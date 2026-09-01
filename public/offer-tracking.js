(() => {
  const products = {
    complete: {
      content_id: 'h5zh6em',
      content_name: 'Protocolo Manchas Zero - Oferta Completa',
      value: 27.90,
      currency: 'BRL',
      checkout_url: 'https://pay.cakto.com.br/h5zh6em',
    },
    upgrade: {
      content_id: '5xyu9sm',
      content_name: 'Protocolo Manchas Zero - Upgrade com Bonus',
      value: 21.90,
      currency: 'BRL',
      checkout_url: 'https://pay.cakto.com.br/5xyu9sm',
    },
    simple: {
      content_id: '3bsv9to_1077048',
      content_name: 'Protocolo Manchas Zero - Oferta Simples',
      value: 17.90,
      currency: 'BRL',
      checkout_url: 'https://pay.cakto.com.br/3bsv9to_1077048',
    },
  };

  const attributionNames = new Set([
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'campaign_id', 'adset_id', 'ad_id', 'fbclid',
  ]);
  const checkoutLocks = new Set();
  let metaPageViewSent = false;
  let metaViewContentSent = false;
  let trackFlowViewContentSent = false;
  const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const debug = (message) => { if (isDevelopment) console.debug(`[tracking] ${message}`); };
  const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  const waitForTrackFlow = async (methodName, timeout = 2000) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeout) {
      try {
        if (window.trackflow && typeof window.trackflow[methodName] === 'function') {
          debug('tracker carregado');
          return window.trackflow[methodName].bind(window.trackflow);
        }
      } catch {}
      await delay(50);
    }
    return null;
  };

  const readCookie = (name) => {
    const prefix = `${name}=`;
    const entry = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
    if (!entry) return '';
    try { return decodeURIComponent(entry.slice(prefix.length)); }
    catch { return entry.slice(prefix.length); }
  };

  const getRealFbc = () => {
    const existingFbc = readCookie('_fbc');
    if (existingFbc) return existingFbc;
    const fbclid = new URLSearchParams(location.search).get('fbclid');
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : '';
  };

  const createCheckoutUrl = (originalUrl) => {
    const destination = new URL(originalUrl);
    const currentParams = new URLSearchParams(location.search);
    attributionNames.forEach((name) => {
      const value = currentParams.get(name);
      if (value) destination.searchParams.set(name, value);
    });

    const fbp = readCookie('_fbp');
    const fbc = getRealFbc();
    if (fbp) destination.searchParams.set('_fbp', fbp);
    if (fbc) destination.searchParams.set('_fbc', fbc);

    let visitorId = '';
    try {
      if (window.trackflow && typeof window.trackflow.visitorId === 'function') {
        visitorId = window.trackflow.visitorId() || '';
      }
    } catch {}
    if (visitorId) destination.searchParams.set('tf_visitor', visitorId);

    return destination.toString();
  };

  const metaPayload = (product) => ({
    content_ids: [product.content_id],
    content_name: product.content_name,
    content_type: 'product',
    value: product.value,
    currency: product.currency,
  });

  const trackFlowPayload = (product) => ({
    content_id: product.content_id,
    content_name: product.content_name,
    value: product.value,
    currency: product.currency,
  });

  const sendMetaPageView = () => {
    if (metaPageViewSent) return true;
    if (typeof window.fbq !== 'function') return false;
    metaPageViewSent = true;
    window.fbq('track', 'PageView');
    document.documentElement.dataset.metaPageView = 'sent';
    return true;
  };

  const sendViewContent = async () => {
    const product = products.complete;
    if (!metaViewContentSent && typeof window.fbq === 'function') {
      metaViewContentSent = true;
      window.fbq('track', 'ViewContent', metaPayload(product));
    }
    if (!trackFlowViewContentSent) {
      const viewContent = await waitForTrackFlow('viewContent');
      if (viewContent && !trackFlowViewContentSent) {
        trackFlowViewContentSent = true;
        viewContent(trackFlowPayload(product));
        debug('viewContent enviado');
      }
    }
  };

  const beginCheckout = async (product) => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', metaPayload(product));
      }
    } catch {}

    const trackFlowBeginCheckout = await waitForTrackFlow('beginCheckout');
    if (trackFlowBeginCheckout) {
      try {
        trackFlowBeginCheckout(trackFlowPayload(product));
        debug('beginCheckout enviado');
        await delay(300);
      } catch {}
    }
    const destination = createCheckoutUrl(product.checkout_url);
    debug('redirecionamento iniciado');
    location.assign(destination);
  };

  const initialize = () => {
    let pageViewAttempts = 0;
    const attemptPageView = () => {
      pageViewAttempts += 1;
      if (!sendMetaPageView() && pageViewAttempts < 50) setTimeout(attemptPageView, 100);
    };
    attemptPageView();

    const pricing = document.getElementById('precos');
    if (pricing) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void sendViewContent();
      }, { rootMargin: '100px' });
      observer.observe(pricing);
    }

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-checkout-plan]');
      if (!link) return;
      const plan = link.dataset.checkoutPlan;
      const product = products[plan];
      if (!product) return;
      event.preventDefault();
      if (checkoutLocks.has(plan)) return;
      checkoutLocks.add(plan);
      void beginCheckout(product);
    }, true);

    addEventListener('pageshow', (event) => {
      if (event.persisted) checkoutLocks.clear();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
