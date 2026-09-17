/* ТҰМАР — общий интерфейс: иконки, орнаменты, шапка, подвал, корзина, модалки, анимации.
   Шапка и подвал рендерятся отсюда, чтобы не дублировать разметку в трёх HTML. */

var TumarUI = (function () {

  /* Иконки — единый набор: 24×24, обводка 1.6. Никаких emoji (styles.csv, анти-паттерн) */
  var I = {
    search: '<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="m20 20-3.6-3.6"/>',
    heart: '<path d="M12 20s-7.5-4.6-9.2-9.1C1.6 7.6 3.8 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.2 0 5.4 3.1 4.2 6.4C19.5 15.4 12 20 12 20Z"/>',
    bag: '<path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    arrowR: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
    arrowL: '<path d="M20 12H5m5-5-5 5 5 5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor" stroke="none"/>',
    needle: '<path d="M20 4 7.5 16.5M17 4h3v3"/><path d="M7.5 16.5c-2 2-4.5 1.5-4.5 1.5s-.5-2.5 1.5-4.5"/><path d="M14 10c3 1 5 3 5 6"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
    swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    home: '<path d="M4 20V10l8-6 8 6v10h-5v-6H9v6H4Z"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.8L4 20Z"/><path d="M9 9.2c.2 2.5 2.7 5 5.3 5.4l1-1.2-1.8-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.8-1.3.8Z"/>',
    telegram: '<path d="m21 4-3 16-6.5-5.2L17 9l-7.5 5L4 12l17-8Z"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.3 5 4.5"/>'
  };

  function icon(name, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' + (extra || '') + '>' + I[name] + '</svg>';
  }

  /* Тумар — треугольный оберег, из него весь графический язык */
  var TUMAR_MARK =
    '<svg class="logo__mark" viewBox="0 0 26 24" aria-hidden="true" focusable="false">' +
      '<path d="M13 1.5 24.5 22.5h-23Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M13 9 18.6 19H7.4Z" fill="currentColor"/>' +
    '</svg>';

  /* Упрощённые геометрические ою-өрнек. Только геометрия — никакой флоры (MASTER.md) */
  var ORNAMENT_SVG = {
    'qoshqar-muiz':
      '<path d="M60 110V62"/>' +
      '<path d="M60 62C60 40 44 26 30 30 16 34 14 52 26 58c10 5 18-4 14-12-3-6-10-4-9 1"/>' +
      '<path d="M60 62C60 40 76 26 90 30c14 4 16 22 4 28-10 5-18-4-14-12 3-6 10-4 9 1"/>' +
      '<path d="M60 94c-6-12-20-14-24-4-3 8 6 12 10 6"/>' +
      '<path d="M60 94c6-12 20-14 24-4 3 8-6 12-10 6"/>',
    'tuye-taban':
      '<path d="M60 42 78 60 60 78 42 60Z"/>' +
      '<path d="M48 48C44 30 54 18 60 13c6 5 16 17 12 35"/>' +
      '<path d="M72 48c18-4 30 6 35 12-5 6-17 16-35 12"/>' +
      '<path d="M72 72c4 18-6 30-12 35-6-5-16-17-12-35"/>' +
      '<path d="M48 72C30 76 18 66 13 60c5-6 17-16 35-12"/>' +
      '<circle cx="60" cy="60" r="4"/>',
    'su':
      '<path d="M6 42c10-16 22-16 30-4s20 12 28 0 20-12 28 0 16 10 22 4"/>' +
      '<path d="M6 64c10-16 22-16 30-4s20 12 28 0 20-12 28 0 16 10 22 4"/>' +
      '<path d="M6 86c10-16 22-16 30-4s20 12 28 0 20-12 28 0 16 10 22 4"/>' +
      '<path d="M22 30c-4-7 5-11 8-5"/><path d="M78 30c-4-7 5-11 8-5"/>',
    'botakoz':
      '<path d="M60 8 112 60 60 112 8 60Z"/>' +
      '<path d="M60 30 90 60 60 90 30 60Z"/>' +
      '<path d="M40 60c8-12 32-12 40 0-8 12-32 12-40 0Z"/>' +
      '<circle cx="60" cy="60" r="6"/>'
  };

  function ornament(key, cls) {
    return '<svg viewBox="0 0 120 120" class="' + (cls || '') + '" aria-hidden="true" focusable="false">' + (ORNAMENT_SVG[key] || '') + '</svg>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isLight(hex) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 170;
  }

  /* Изображение поверх орнаментальной плашки. См. .ph в style.css */
  function media(src, alt, label, tint, opts) {
    opts = opts || {};
    return '<div class="ph' + (opts.cls ? ' ' + opts.cls : '') + '" data-label="' + esc(label || '') + '"' +
      (tint && isLight(tint) ? ' data-light' : '') +
      ' style="--tint:' + (tint || 'var(--night-3)') + '">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '"' +
      (opts.fallback && opts.fallback.length ? ' data-fallback="' + esc(opts.fallback.join('|')) + '"' : '') +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' +
    '</div>';
  }

  function markImage(img) {
    var ph = img.closest('.ph');
    if (!ph) return;
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
      ph.classList.add('has-image');
    } else if (img.complete && !img.getAttribute('data-fallback')) {
      img.classList.add('is-missing');
    }
  }

  function hydrateImages(root) {
    (root || document).querySelectorAll('.ph img').forEach(markImage);
  }

  /* load/error не всплывают — ловим на фазе захвата */
  document.addEventListener('load', function (e) {
    if (e.target.tagName === 'IMG') markImage(e.target);
  }, true);
  /* data-fallback="a.jpg|b.jpg": если фото ещё не сгенерировано, берём следующее по списку.
     Когда нужный файл появится в img/, плитка сама покажет его — код менять не нужно */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG' || !img.closest('.ph')) return;
    var rest = (img.getAttribute('data-fallback') || '').split('|').filter(Boolean);
    if (rest.length) {
      img.setAttribute('data-fallback', rest.slice(1).join('|'));
      img.src = rest[0];
      return;
    }
    img.classList.add('is-missing');
  }, true);

  /* Карточка товара ----------------------------------------------------------- */
  function sizeRange(p) {
    return p.sizes.length > 1 ? p.sizes[0] + '–' + p.sizes[p.sizes.length - 1] : p.sizes[0];
  }

  function badgeHtml(p) {
    var b = '';
    if (p.badge) {
      var cls = p.badge === 'Скидка' ? 'badge--rust' : '';
      b += '<span class="badge ' + cls + '">' + esc(p.badge) + '</span>';
    }
    if (p.handmade) b += '<span class="badge badge--olive">Қолөнер</span>';
    return b;
  }

  function card(p, i) {
    var label = p.type + ' «' + p.name + '»';
    var fav = TumarStore.isFav(p.id);
    var sizes = p.sizes.map(function (s) {
      return '<button type="button" class="size-btn" data-quick-add="' + p.id + '" data-size="' + esc(s) + '">' + esc(s) + '</button>';
    }).join('');
    return '' +
      '<article class="card reveal" style="--d:' + ((i || 0) % 4) * 90 + 'ms">' +
        '<div class="card__media">' +
          media(p.img[0], label + ', фото', label, p.tint) +
          (p.img[1] ? media(p.img[1], '', label, p.tint, { cls: 'ph--alt' }) : '') +
          '<div class="card__badges">' + badgeHtml(p) + '</div>' +
          '<button type="button" class="card__fav" data-fav="' + p.id + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Убрать из избранного: ' : 'В избранное: ') + esc(label) + '">' + icon('heart') + '</button>' +
          '<div class="card__quick t-felt" role="group" aria-label="Быстро в корзину: ' + esc(label) + '">' +
            '<span class="card__quick-label">В корзину · размер</span>' +
            '<div class="card__qsizes">' + sizes + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__type">' + esc(p.type) + '</span>' +
          '<h3 class="card__name"><a href="product.html?id=' + p.id + '">' + esc(p.name) + '</a></h3>' +
          '<div class="card__row">' +
            '<span class="price">' + TumarData.price(p.price) + (p.oldPrice ? '<s>' + TumarData.price(p.oldPrice) + '</s>' : '') + '</span>' +
            '<span class="card__meta">' + icon('star') + '<span class="num">' + p.rating.toFixed(1) + '</span></span>' +
          '</div>' +
          '<span class="card__sizes">Размеры ' + esc(sizeRange(p)) + '</span>' +
        '</div>' +
      '</article>';
  }

  /* Шапка --------------------------------------------------------------------- */
  var MARQUEE_ITEMS = ['Қазақстанда тігілген', 'Доставка по Казахстану и России', 'Ручная вышивка ою-өрнек', 'Бесплатно от 150 000 ₸', 'Обмен 14 дней'];

  function marquee(items, big) {
    var group = '<span>' + items.map(esc).join('</span><span>') + '</span>';
    return '<div class="marquee' + (big ? ' marquee--big' : '') + '">' +
      '<p class="sr-only">' + items.map(esc).join('. ') + '</p>' +
      '<div class="marquee__track" aria-hidden="true">' +
        '<div class="marquee__group">' + group + '</div>' +
        '<div class="marquee__group">' + group + '</div>' +
      '</div>' +
    '</div>';
  }

  var NAV = [
    { href: 'catalog.html', label: 'Каталог', key: 'catalog' },
    { href: 'index.html#collections', label: 'Коллекциялар', key: 'collections' },
    { href: 'index.html#oyu', label: 'Ою-өрнек', key: 'oyu' },
    { href: 'index.html#story', label: 'О бренде', key: 'story' }
  ];

  function renderHeader(opts) {
    var slot = document.querySelector('[data-slot="header"]');
    if (!slot) return;
    var overlay = opts.overlay;
    var nav = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (opts.current === n.key ? ' aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');

    slot.outerHTML =
      '<a class="skip-link" href="#main">Перейти к содержимому</a>' +
      '<header class="header t-night ' + (overlay ? 'header--overlay' : 'header--solid') + '" id="site-header">' +
        '<div class="header__marquee">' + marquee(MARQUEE_ITEMS) + '</div>' +
        '<div class="wrap header__inner">' +
          '<div class="header__left">' +
            '<nav class="header__nav" aria-label="Основная навигация">' + nav + '</nav>' +
            '<button type="button" class="icon-btn menu-btn" aria-label="Открыть меню" aria-expanded="false" aria-controls="mnav" data-open-menu>' + icon('menu') + '</button>' +
          '</div>' +
          '<a class="logo" href="index.html" aria-label="ТҰМАР — на главную">' + TUMAR_MARK + '<span class="logo__word" aria-hidden="true">ТҰМАР</span></a>' +
          '<div class="header__actions">' +
            '<a class="icon-btn hide-sm" href="catalog.html" aria-label="Каталог и поиск">' + icon('search') + '</a>' +
            '<a class="icon-btn" href="catalog.html?fav=1" aria-label="Избранное" data-fav-link>' + icon('heart') + '<span class="count" data-fav-count data-n="0"></span></a>' +
            '<button type="button" class="icon-btn" aria-label="Корзина" aria-expanded="false" aria-controls="cart" data-open-cart>' + icon('bag') + '<span class="count" data-cart-count data-n="0"></span></button>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="mnav t-night grain" id="mnav" role="dialog" aria-modal="true" aria-label="Меню">' +
        '<div class="mnav__head">' +
          '<a class="logo" href="index.html" aria-label="ТҰМАР — на главную">' + TUMAR_MARK + '<span class="logo__word" aria-hidden="true">ТҰМАР</span></a>' +
          '<button type="button" class="icon-btn" aria-label="Закрыть меню" data-close>' + icon('close') + '</button>' +
        '</div>' +
        '<nav class="mnav__links" aria-label="Мобильная навигация">' + nav + '</nav>' +
        '<div class="mnav__foot">Шымкент · Алматы<br>+7 700 000 00 00</div>' +
      '</div>';

    var header = document.getElementById('site-header');
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (overlay) header.classList.toggle('is-solid', y > window.innerHeight * 0.55);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    document.querySelectorAll('.mnav__links a').forEach(function (a) {
      a.addEventListener('click', function () { closeLayer(document.getElementById('mnav')); });
    });
  }

  /* Подвал -------------------------------------------------------------------- */
  function renderFooter() {
    var slot = document.querySelector('[data-slot="footer"]');
    if (!slot) return;
    var year = new Date().getFullYear();
    slot.outerHTML =
      '<footer class="footer t-night grain">' +
        '<div class="wrap">' +
          '<div class="footer__grid">' +
            '<div class="footer__about">' +
              '<a class="logo" href="index.html" aria-label="ТҰМАР — на главную">' + TUMAR_MARK + '<span class="logo__word" aria-hidden="true">ТҰМАР</span></a>' +
              '<p>Современная казахская одежда с ручной вышивкой. Шьём в Шымкенте, отправляем по Казахстану и России.</p>' +
              '<div class="socials">' +
                '<a class="icon-btn" href="#" aria-label="Instagram">' + icon('instagram') + '</a>' +
                '<a class="icon-btn" href="#" aria-label="WhatsApp">' + icon('whatsapp') + '</a>' +
                '<a class="icon-btn" href="#" aria-label="Telegram">' + icon('telegram') + '</a>' +
                '<a class="icon-btn" href="#" aria-label="TikTok">' + icon('tiktok') + '</a>' +
              '</div>' +
            '</div>' +
            '<div><h3>Каталог</h3><ul>' +
              TUMAR_CATEGORIES.map(function (c) { return '<li><a href="catalog.html?cat=' + c.id + '">' + c.name + '</a></li>'; }).join('') +
            '</ul></div>' +
            '<div><h3>Покупателям</h3><ul>' +
              '<li><a href="#">Доставка и оплата</a></li><li><a href="#">Обмен и возврат</a></li>' +
              '<li><a href="#">Таблица размеров</a></li><li><a href="#">Уход за вещами</a></li>' +
            '</ul></div>' +
            '<div><h3>Бутики</h3><ul>' +
              '<li><a href="#">Шымкент, Самал 75</a></li><li><a href="#">Алматы, Абая 44</a></li>' +
              '<li><a href="#">+7 700 000 00 00</a></li><li><a href="#">hello@tumar.kz</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer__bottom">' +
            '<span>© ' + year + ' ТҰМАР. Концепт-проект для портфолио.</span>' +
            '<span>Қорғайтын киім — оберег, который носят</span>' +
          '</div>' +
        '</div>' +
        '<div class="footer__word" aria-hidden="true">ТҰМАР</div>' +
      '</footer>';
  }

  /* Слои: шторка, модалка, меню. Фокус внутри, Esc закрывает, фокус возвращается на кнопку */
  var overlayEl = null;
  var openStack = [];

  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.className = 'overlay';
    overlayEl.addEventListener('click', function () {
      if (openStack.length) closeLayer(openStack[openStack.length - 1].el);
    });
    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  function openLayer(el, trigger) {
    if (!el || el.classList.contains('is-open')) return;
    ensureOverlay().classList.add('is-open');
    el.classList.add('is-open');
    document.body.classList.add('is-locked');
    openStack.push({ el: el, trigger: trigger || document.activeElement });
    if (trigger && trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    window.setTimeout(function () {
      var first = el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
      if (first) first.focus({ preventScroll: true });
    }, 60);
  }

  function closeLayer(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    var idx = -1;
    openStack.forEach(function (s, i) { if (s.el === el) idx = i; });
    var entry = idx !== -1 ? openStack.splice(idx, 1)[0] : null;
    if (!openStack.length) {
      overlayEl && overlayEl.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    }
    if (entry && entry.trigger) {
      if (entry.trigger.hasAttribute('aria-expanded')) entry.trigger.setAttribute('aria-expanded', 'false');
      if (document.contains(entry.trigger)) entry.trigger.focus({ preventScroll: true });
    }
  }

  document.addEventListener('keydown', function (e) {
    if (!openStack.length) return;
    var top = openStack[openStack.length - 1].el;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(top); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(top.querySelectorAll(FOCUSABLE), function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('click', function (e) {
    var close = e.target.closest('[data-close]');
    if (close) { closeLayer(close.closest('.drawer, .modal, .mnav, .filters')); return; }
    var menu = e.target.closest('[data-open-menu]');
    if (menu) { openLayer(document.getElementById('mnav'), menu); return; }
    var cartBtn = e.target.closest('[data-open-cart]');
    if (cartBtn) { renderCart(); openLayer(document.getElementById('cart'), cartBtn); }
  });

  /* Корзина ------------------------------------------------------------------- */
  function renderCartShell() {
    if (document.getElementById('cart')) return;
    var d = document.createElement('aside');
    d.className = 'drawer t-felt';
    d.id = 'cart';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'cart-title');
    d.innerHTML =
      '<div class="drawer__head">' +
        '<h2 class="drawer__title" id="cart-title">Себет <span class="num" data-cart-title-count></span></h2>' +
        '<button type="button" class="icon-btn" aria-label="Закрыть корзину" data-close>' + icon('close') + '</button>' +
      '</div>' +
      '<div class="drawer__body" data-cart-body></div>' +
      '<div class="drawer__foot" data-cart-foot></div>';
    document.body.appendChild(d);

    d.addEventListener('click', function (e) {
      var q = e.target.closest('[data-qty]');
      if (q) {
        var key = q.getAttribute('data-key');
        var line = TumarStore.cart().filter(function (it) { return TumarStore.lineKey(it.id, it.color, it.size) === key; })[0];
        if (line) TumarStore.setQty(key, line.qty + Number(q.getAttribute('data-qty')));
        return;
      }
      var rm = e.target.closest('[data-remove]');
      if (rm) { TumarStore.remove(rm.getAttribute('data-remove')); return; }
      var co = e.target.closest('[data-checkout]');
      if (co) { toast('Оформление заказа — демо-режим портфолио'); }
    });

    d.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-promo]')) return;
      e.preventDefault();
      var input = e.target.querySelector('input');
      var hint = e.target.parentNode.querySelector('[data-promo-hint]');
      var ok = TumarStore.applyPromo(input.value);
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok && hint) { hint.textContent = 'Такого промокода нет. Попробуйте TUMAR10'; hint.className = 'field__hint is-error'; }
    });
  }

  function renderCart() {
    renderCartShell();
    var items = TumarStore.cart();
    var body = document.querySelector('[data-cart-body]');
    var foot = document.querySelector('[data-cart-foot]');
    var n = TumarStore.count();
    document.querySelector('[data-cart-title-count]').textContent = n ? '(' + n + ')' : '';

    if (!items.length) {
      body.innerHTML =
        '<div class="drawer__empty">' +
          '<svg class="empty__mark" viewBox="0 0 56 50" aria-hidden="true"><path d="M28 3 53 47H3Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M28 20 38 38H18Z" fill="currentColor"/></svg>' +
          '<h3 class="h3">Себет бос</h3>' +
          '<p>Корзина пока пуста. Начните с шапана — с него начинается любой гардероб.</p>' +
          '<a class="btn btn--primary" href="catalog.html">В каталог</a>' +
        '</div>';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;

    body.innerHTML = '<ul>' + items.map(function (it) {
      var p = TumarData.byId(it.id);
      var color = p.colors.filter(function (c) { return c.id === it.color; })[0] || p.colors[0];
      var key = TumarStore.lineKey(it.id, it.color, it.size);
      var label = p.type + ' «' + p.name + '»';
      return '<li class="line-item">' +
        '<a class="line-item__media" href="product.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + media(p.img[0], '', p.name, p.tint) + '</a>' +
        '<div>' +
          '<div class="line-item__top">' +
            '<div><a class="line-item__name" href="product.html?id=' + p.id + '">' + esc(label) + '</a>' +
            '<div class="line-item__opts">' + esc(color.name) + ' · размер ' + esc(it.size) + '</div></div>' +
            '<button type="button" class="icon-btn line-item__remove" data-remove="' + esc(key) + '" aria-label="Удалить ' + esc(label) + ', размер ' + esc(it.size) + '">' + icon('trash') + '</button>' +
          '</div>' +
          '<div class="line-item__bottom">' +
            '<div class="qty" role="group" aria-label="Количество">' +
              '<button type="button" data-qty="-1" data-key="' + esc(key) + '" aria-label="Уменьшить">' + icon('minus') + '</button>' +
              '<output aria-live="polite">' + it.qty + '</output>' +
              '<button type="button" data-qty="1" data-key="' + esc(key) + '" aria-label="Увеличить"' + (it.qty >= 10 ? ' disabled' : '') + '>' + icon('plus') + '</button>' +
            '</div>' +
            '<span class="price">' + TumarData.price(p.price * it.qty) + '</span>' +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('') + '</ul>';

    var t = TumarStore.totals();
    var pct = Math.min(100, Math.round((1 - t.toFree / TumarStore.FREE_SHIPPING_FROM) * 100));
    var promo = TumarStore.promo();
    foot.innerHTML =
      '<div class="ship">' +
        '<span>' + (t.toFree > 0 ? 'До бесплатной доставки ещё <strong class="num">' + TumarData.price(t.toFree) + '</strong>' : 'Доставка бесплатная') + '</span>' +
        '<div class="ship__bar" role="progressbar" aria-label="Прогресс до бесплатной доставки" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
      '</div>' +
      (promo ? '' :
      '<div class="field">' +
        '<form class="promo" data-promo novalidate>' +
          '<label class="sr-only" for="promo-code">Промокод</label>' +
          '<input class="input" id="promo-code" name="promo" placeholder="Промокод" autocomplete="off" aria-describedby="promo-hint">' +
          '<button class="btn btn--ghost" type="submit">Применить</button>' +
        '</form>' +
        '<span class="field__hint" id="promo-hint" data-promo-hint aria-live="polite">Для теста: TUMAR10</span>' +
      '</div>') +
      '<div class="totals">' +
        '<div><span class="muted">Товары</span><span class="num">' + TumarData.price(t.subtotal) + '</span></div>' +
        (t.discount ? '<div><span class="muted">Скидка ' + esc(promo) + '</span><span class="num">−' + TumarData.price(t.discount) + '</span></div>' : '') +
        '<div><span class="muted">Доставка</span><span class="num">' + (t.shipping ? TumarData.price(t.shipping) : 'Бесплатно') + '</span></div>' +
        '<div class="total"><span>Итого</span><span>' + TumarData.price(t.total) + '</span></div>' +
      '</div>' +
      '<button type="button" class="btn btn--primary btn--block" data-checkout>Оформить заказ</button>';

    hydrateImages(body);
  }

  function updateCounts() {
    var n = TumarStore.count();
    var f = TumarStore.favs().length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      if (el.getAttribute('data-n') !== String(n) && n > 0) {
        el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
      }
      el.textContent = n || '';
      el.setAttribute('data-n', n);
      var btn = el.closest('[data-open-cart]');
      if (btn) btn.setAttribute('aria-label', 'Корзина, товаров: ' + n);
    });
    document.querySelectorAll('[data-fav-count]').forEach(function (el) {
      el.textContent = f || '';
      el.setAttribute('data-n', f);
      var a = el.closest('[data-fav-link]');
      if (a) a.setAttribute('aria-label', 'Избранное, товаров: ' + f);
    });
  }

  document.addEventListener('tumar:change', function (e) {
    updateCounts();
    var cart = document.getElementById('cart');
    if (cart && e.detail.type === 'cart') renderCart();
    if (e.detail.type === 'fav') {
      document.querySelectorAll('[data-fav]').forEach(function (b) {
        var id = b.getAttribute('data-fav');
        var on = TumarStore.isFav(id);
        b.setAttribute('aria-pressed', on);
        var p = TumarData.byId(id);
        if (p) b.setAttribute('aria-label', (on ? 'Убрать из избранного: ' : 'В избранное: ') + p.type + ' «' + p.name + '»');
      });
    }
  });

  /* Избранное и быстрое добавление — делегирование, работает для любых отрендеренных карточек */
  document.addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) {
      e.preventDefault();
      var added = TumarStore.toggleFav(fav.getAttribute('data-fav'));
      toast(added ? 'Добавлено в избранное' : 'Убрано из избранного');
      return;
    }
    var q = e.target.closest('[data-quick-add]');
    if (q) {
      e.preventDefault();
      var p = TumarData.byId(q.getAttribute('data-quick-add'));
      var size = q.getAttribute('data-size');
      TumarStore.add(p.id, p.colors[0].id, size, 1);
      toast(p.type + ' «' + p.name + '», ' + size + ' — в корзине', true);
    }
  });

  /* Тост ---------------------------------------------------------------------- */
  var toastEl = null, toastTimer = null;
  function toast(message, withCart) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = icon('check') + '<span>' + esc(message) + '</span>' +
      (withCart ? '<button type="button" class="btn btn--primary" data-open-cart>Корзина</button>' : '');
    window.clearTimeout(toastTimer);
    void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    toastTimer = window.setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }

  /* Появление при прокрутке ----------------------------------------------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = ('IntersectionObserver' in window) && !reduceMotion
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.remove('is-pending');
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    : null;

  /* Прячем в ожидание только то, что ниже первого экрана, и только в видимой вкладке.
     В скрытой вкладке и на превью анимационные часы стоят — там всё сразу в покое */
  function observe(root) {
    var nodes = (root || document).querySelectorAll('.reveal:not(.is-in):not(.is-pending), .reveal-draw:not(.is-in):not(.is-pending)');
    var canAnimate = io && !document.hidden;
    nodes.forEach(function (n) {
      if (n.classList.contains('reveal-draw')) {
        n.querySelectorAll('path, circle, rect').forEach(function (s) {
          try { s.style.setProperty('--len', Math.ceil(s.getTotalLength()) + 1); } catch (err) { /* не SVG-геометрия */ }
        });
      }
      if (canAnimate && n.getBoundingClientRect().top > window.innerHeight * 0.92) {
        n.classList.add('is-pending');
        io.observe(n);
      } else {
        n.classList.add('is-in');
      }
    });
  }

  /* Параллакс — только transform, через rAF */
  function parallax(el, strength) {
    if (!el || reduceMotion) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) el.style.transform = 'translate3d(0,' + (y * strength).toFixed(1) + 'px,0)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function init(opts) {
    renderHeader(opts || {});
    renderFooter();
    renderCartShell();
    updateCounts();
    observe();
    hydrateImages();
  }

  return {
    init: init,
    icon: icon,
    ornament: ornament,
    media: media,
    card: card,
    esc: esc,
    toast: toast,
    observe: observe,
    parallax: parallax,
    hydrateImages: hydrateImages,
    openLayer: openLayer,
    closeLayer: closeLayer,
    marquee: marquee,
    TUMAR_MARK: TUMAR_MARK
  };
})();
