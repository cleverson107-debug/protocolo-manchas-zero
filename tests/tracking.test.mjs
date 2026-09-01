import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

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
