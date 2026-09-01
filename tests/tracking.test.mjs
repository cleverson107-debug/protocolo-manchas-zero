import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const tracking = readFileSync(new URL('../public/offer-tracking.js', import.meta.url), 'utf8');
const browserCode = `${layout}\n${page}\n${tracking}`;

test('installs Meta and TrackFlow exactly once', () => {
  assert.equal((layout.match(/813194448363424/g) || []).length, 2);
  assert.equal((layout.match(/app\.upnexa\.com\.br\/api\/public\/tracker\.js/g) || []).length, 1);
  assert.equal((layout.match(/data-site="tf_Bzm6TqPn820c1sG_"/g) || []).length, 1);
  assert.equal((browserCode.match(/fbq\('track', 'PageView'\)/g) || []).length, 1);
  assert.match(tracking, /metaPageViewSent/);
});

test('does not send financial browser events', () => {
  assert.doesNotMatch(browserCode, /fbq\([^\n]*['"](?:Purchase|AddPaymentInfo)['"]/);
  assert.doesNotMatch(browserCode, /trackflow\.(?:purchase|addPaymentInfo)\s*\(/i);
  assert.doesNotMatch(browserCode, /metaPurchase\s*\(/);
});

test('configures the three checkout plans with their real prices', () => {
  assert.match(tracking, /content_id: 'h5zh6em'[\s\S]*?value: 27\.90/);
  assert.match(tracking, /content_id: '5xyu9sm'[\s\S]*?value: 21\.90/);
  assert.match(tracking, /content_id: '3bsv9to_1077048'[\s\S]*?value: 17\.90/);
  assert.equal((page.match(/data-checkout-plan=/g) || []).length, 3);
});

test('preserves required attribution and protects events per plan', () => {
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','campaign_id','adset_id','ad_id','fbclid','_fbp','_fbc','tf_visitor']) {
    assert.ok(tracking.includes(key), `missing ${key}`);
  }
  assert.match(tracking, /checkoutLocks\.has\(plan\)/);
  assert.match(tracking, /checkoutLocks\.add\(plan\)/);
  assert.match(tracking, /typeof window\.fbq === 'function'/);
  assert.match(tracking, /typeof window\.trackflow\.beginCheckout === 'function'/);
});

const runTrackingScenario = async ({ search = '', cookie = '' } = {}) => {
  const metaEvents = [];
  const trackFlowEvents = [];
  const destinations = [];
  let clickHandler;
  const link = {
    href: 'https://pay.cakto.com.br/h5zh6em',
    dataset: { checkoutPlan: 'complete' },
  };
  const context = {
    URL,
    URLSearchParams,
    Date,
    setTimeout,
    clearTimeout,
    location: {
      search,
      assign: (url) => destinations.push(url),
    },
    document: {
      cookie,
      readyState: 'complete',
      documentElement: { dataset: {} },
      querySelectorAll: () => [link],
      getElementById: () => null,
      addEventListener: (name, handler) => { if (name === 'click') clickHandler = handler; },
    },
    addEventListener: () => {},
  };
  context.window = context;
  context.fbq = (...args) => metaEvents.push(args);
  context.trackflow = {
    visitorId: () => 'visitor-real-current-session',
    beginCheckout: (payload) => trackFlowEvents.push(payload),
  };
  vm.runInNewContext(tracking, context);
  assert.ok(clickHandler, 'checkout click handler was not registered');
  const event = { target: { closest: () => link }, preventDefault: () => {} };
  clickHandler(event);
  clickHandler(event);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { link, metaEvents, trackFlowEvents, destinations };
};

test('organic session does not invent fbclid, fbc or fbp', async () => {
  const result = await runTrackingScenario();
  assert.equal(result.link.href, 'https://pay.cakto.com.br/h5zh6em');
  assert.equal(result.destinations.length, 1);
  const destination = new URL(result.destinations[0]);
  assert.equal(destination.searchParams.has('fbclid'), false);
  assert.equal(destination.searchParams.has('_fbc'), false);
  assert.equal(destination.searchParams.has('_fbp'), false);
  assert.equal(destination.searchParams.get('tf_visitor'), 'visitor-real-current-session');
});

test('UTM session preserves UTMs without inventing fbc', async () => {
  const result = await runTrackingScenario({ search: '?utm_source=teste&utm_medium=cpc&utm_campaign=validacao' });
  const destination = new URL(result.destinations[0]);
  assert.equal(destination.searchParams.get('utm_source'), 'teste');
  assert.equal(destination.searchParams.get('utm_medium'), 'cpc');
  assert.equal(destination.searchParams.get('utm_campaign'), 'validacao');
  assert.equal(destination.searchParams.has('_fbc'), false);
});

test('Meta session preserves a unique fbclid and creates fbc only for that click id', async () => {
  const uniqueFbclid = `VALIDATION_${Date.now()}_CaseSensitive`;
  const result = await runTrackingScenario({ search: `?fbclid=${uniqueFbclid}` });
  const destination = new URL(result.destinations[0]);
  assert.equal(destination.searchParams.get('fbclid'), uniqueFbclid);
  assert.ok(destination.searchParams.get('_fbc').endsWith(`.${uniqueFbclid}`));
});

test('checkout click emits once and never changes the original href', async () => {
  const result = await runTrackingScenario({ cookie: '_fbp=real-fbp; _fbc=real-fbc' });
  assert.equal(result.link.href, 'https://pay.cakto.com.br/h5zh6em');
  assert.equal(result.metaEvents.filter((event) => event[1] === 'InitiateCheckout').length, 1);
  assert.equal(result.trackFlowEvents.length, 1);
  assert.equal(result.destinations.length, 1);
  const destination = new URL(result.destinations[0]);
  assert.equal(destination.searchParams.get('_fbp'), 'real-fbp');
  assert.equal(destination.searchParams.get('_fbc'), 'real-fbc');
});
