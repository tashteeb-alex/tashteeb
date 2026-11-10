(function () {
  var C = window.CONFIG || {};
  var html = document.documentElement;
  var isAr = function () { return html.lang === 'ar'; };

  /* ---------- Language (device language by default, saved choice wins) ---------- */
  function setLang(l, save) {
    html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr';
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
    var b = document.getElementById('langBtn');
    if (b) b.setAttribute('aria-label', l === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  }
  var langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', function () { setLang(isAr() ? 'en' : 'ar', true); });
  setLang(html.lang === 'ar' ? 'ar' : 'en', false);

  /* ---------- Tracking (loads only if IDs are set) ---------- */
  function track(fbEvent, gaEvent, params) {
    try { if (window.fbq && fbEvent) fbq('track', fbEvent, params || {}); } catch (e) {}
    try { if (window.gtag && gaEvent) gtag('event', gaEvent, params || {}); } catch (e) {}
  }
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.metaPixelId); fbq('track', 'PageView');
  }
  if (C.googleAnalyticsId) {
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.googleAnalyticsId;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', C.googleAnalyticsId);
  }

  /* ---------- WhatsApp ---------- */
  var waUrl = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent('Hi, I would like to ask about a finishing service. / أهلا، عايز أستفسر عن خدمة تشطيب.');
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.href = waUrl; a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () { track('Contact', 'whatsapp_click'); });
  });

  /* ---------- Join (contractor) form ---------- */
  document.querySelectorAll('.js-join').forEach(function (a) {
    a.href = C.contractorForm || waUrl; a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () { track('CompleteRegistration', 'contractor_apply_click'); });
  });

  /* ---------- Client form embed ---------- */
  var box = document.getElementById('clientFormBox');
  if (box) {
    if (C.clientForm) {
      var src = C.clientForm.split('?')[0].replace(/\/viewform.*$/, '') + '/viewform?embedded=true';
      box.innerHTML =
        '<div class="form-top"><span><span data-en>Form not loading?</span><span data-ar>الفورم مش ظاهر؟</span></span>' +
        '<a href="' + C.clientForm + '" target="_blank" rel="noopener"><span data-en>Open it in a new tab</span><span data-ar>افتحه في صفحة جديدة</span></a></div>' +
        '<iframe src="' + src + '" loading="lazy" title="Service request form"></iframe>';
      // Google Forms reloads the frame after submit: the 2nd load = a submitted request
      var loads = 0;
      box.querySelector('iframe').addEventListener('load', function () {
        loads++;
        if (loads === 2) { track('Lead', 'generate_lead'); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    } else {
      box.innerHTML = '<div class="form-fallback"><p><span data-en>Send us your request on WhatsApp.</span><span data-ar>ابعت طلبك على واتساب.</span></p><a class="btn btn-primary js-wa" href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a></div>';
    }
  }

  /* ---------- Services grid ---------- */
  var SERVICES = [
    ['Plumbing', 'سباكة', '<path d="M7 3v6a5 5 0 0010 0V3M12 14v7M8 21h8"/>'],
    ['Electrical', 'كهرباء', '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'],
    ['Painting', 'نقاشة', '<rect x="3" y="3" width="15" height="7" rx="1"/><path d="M18 6h2v6h-8v3M11 15h2v6h-2z"/>'],
    ['Plastering', 'محارة', '<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>'],
    ['Tiling', 'سيراميك وبورسلين', '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>'],
    ['Carpentry', 'نجارة', '<path d="M3 21l9-9M14 4l6 6-8 8-6-6z"/>'],
    ['Gypsum board', 'جبس بورد', '<path d="M3 7h18M3 12h18M3 17h18M8 7v10M16 7v10"/>'],
    ['Aluminum', 'ألوميتال', '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/>'],
    ['AC', 'تكييف', '<rect x="2" y="5" width="20" height="9" rx="2"/><path d="M6 18v2M12 18v3M18 18v2M6 10h12"/>'],
    ['Insulation', 'عزل', '<path d="M12 2s7 7 7 12a7 7 0 01-14 0c0-5 7-12 7-12z"/>']
  ];
  var grid = document.getElementById('svcGrid');
  if (grid) {
    grid.innerHTML = SERVICES.map(function (s) {
      return '<div class="svc"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">' + s[2] + '</svg></span>' +
        '<b><span data-en>' + s[0] + '</span><span data-ar>' + s[1] + '</span></b>' +
        '<span class="alt-name"><span data-en class="ar-inline">' + s[1] + '</span><span data-ar>' + s[0] + '</span></span></div>';
    }).join('');
  }

  /* ---------- Galleries (photos from CONFIG.gallery) ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (el) {
    var list = (C.gallery && C.gallery[el.getAttribute('data-gallery')]) || [];
    if (!list.length) return; // keep the "coming soon" placeholder
    el.innerHTML = list.map(function (p) {
      return '<figure class="shot"><img src="' + p.src + '" alt="' + (p.en || '') + '" loading="lazy">' +
        '<figcaption><span data-en>' + (p.en || '') + '</span><span data-ar>' + (p.ar || p.en || '') + '</span></figcaption></figure>';
    }).join('');
    el.classList.add('has-photos');
  });

  /* ---------- Social + year ---------- */
  [['facebook', 'fbLink'], ['instagram', 'igLink']].forEach(function (x) {
    var a = document.getElementById(x[1]);
    if (!a) return;
    if (C[x[0]]) a.href = C[x[0]]; else a.parentNode.style.display = 'none';
  });
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile menu (accessible) ---------- */
  var links = document.getElementById('links'), menuBtn = document.getElementById('menuBtn');
  function closeMenu() { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  if (links && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var f = links.querySelector('a'); if (f) f.focus(); }
    });
    links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
    });
  }

  /* ---------- Highlight the current section in the menu ---------- */
  if ('IntersectionObserver' in window && links) {
    var navA = {};
    links.querySelectorAll('a[href^="#"]').forEach(function (a) { navA[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && navA[en.target.id]) {
          Object.keys(navA).forEach(function (k) { navA[k].classList.remove('active'); navA[k].removeAttribute('aria-current'); });
          navA[en.target.id].classList.add('active'); navA[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navA).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
