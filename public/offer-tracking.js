(() => {
  const products = {
    complete: {
      content_id: 'h5zh6em',
      content_name: 'Protocolo Manchas Zero - Oferta Completa',
      value: 27.90,
      currency: 'BRL',
    },
    upgrade: {
      content_id: '5xyu9sm',
      content_name: 'Protocolo Manchas Zero - Upgrade com Bonus',
      value: 21.90,
      currency: 'BRL',
    },
    simple: {
      content_id: '3bsv9to_1077048',
      content_name: 'Protocolo Manchas Zero - Oferta Simples',
      value: 17.90,
      currency: 'BRL',
    },
  };

  const attributionNames = new Set([
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'campaign_id', 'adset_id', 'ad_id', 'fbclid',
  ]);
  const checkoutLocks = new Set();
  let metaViewContentSent = false;
  let trackFlowViewContentSent = false;

  const readCookie = (name) => {
    const prefix = `${name}=`;
    const entry = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
    return entry ? entry.slice(prefix.length) : '';
  };

  const rawAttribution = () => location.search.slice(1).split('&').filter((part) => {
    if (!part) return false;
    const rawName = part.split('=', 1)[0];
    return attributionNames.has(rawName);
  });

  const decorateCheckoutUrl = (href) => {
    const [base, hash = ''] = href.split('#', 2);
    const [path, query = ''] = base.split('?', 2);
    const existingNames = new Set(query.split('&').filter(Boolean).map((part) => part.split('=', 1)[0]));
    const additions = rawAttribution().filter((part) => !existingNames.has(part.split('=', 1)[0]));
    let trackFlowVisitor = readCookie('tf_visitor') || readCookie('_tf_vid');
    if (!trackFlowVisitor) {
      try {
        trackFlowVisitor = (window.trackflow && typeof window.trackflow.visitorId === 'function' && window.trackflow.visitorId())
          || localStorage.getItem('tf_visitor')
          || localStorage.getItem('_tf_vid')
          || '';
      } catch { trackFlowVisitor = ''; }
    }
    const identifiers = {
      _fbp: readCookie('_fbp'),
      _fbc: readCookie('_fbc'),
      tf_visitor: trackFlowVisitor,
    };
    Object.entries(identifiers).forEach(([name, value]) => {
      if (value && !existingNames.has(name)) additions.push(`${name}=${encodeURIComponent(value)}`);
    });
    const combined = [query, ...additions].filter(Boolean).join('&');
    return `${path}${combined ? `?${combined}` : ''}${hash ? `#${hash}` : ''}`;
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

  const sendViewContent = () => {
    const product = products.complete;
    if (!metaViewContentSent && typeof window.fbq === 'function') {
      metaViewContentSent = true;
      window.fbq('track', 'ViewContent', metaPayload(product));
    }
    if (!trackFlowViewContentSent && window.trackflow && typeof window.trackflow.viewContent === 'function') {
      trackFlowViewContentSent = true;
      window.trackflow.viewContent(trackFlowPayload(product));
    }
    return metaViewContentSent && trackFlowViewContentSent;
  };

  const beginCheckout = (product, destination) => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', metaPayload(product));
      }
    } catch {}

    let attempts = 0;
    const finish = () => location.assign(destination);
    const sendTrackFlow = () => {
      attempts += 1;
      try {
        if (window.trackflow && typeof window.trackflow.beginCheckout === 'function') {
          window.trackflow.beginCheckout(trackFlowPayload(product));
          setTimeout(finish, 80);
          return;
        }
      } catch {}
      if (attempts < 5) setTimeout(sendTrackFlow, 20);
      else finish();
    };
    sendTrackFlow();
  };

  const initialize = () => {
    document.querySelectorAll('a[data-checkout-plan]').forEach((link) => {
      link.href = decorateCheckoutUrl(link.href);
    });

    const pricing = document.getElementById('precos');
    if (pricing) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        let attempts = 0;
        const attempt = () => {
          attempts += 1;
          if (!sendViewContent() && attempts < 50) setTimeout(attempt, 100);
        };
        attempt();
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
      const destination = decorateCheckoutUrl(link.href);
      beginCheckout(product, destination);
    }, true);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
