/* ТҰМАР — карточка товара. Одна страница на все товары: product.html?id=… */
(function () {
  var U = TumarUI;
  var root = document.querySelector('[data-product-root]');
  var id = new URLSearchParams(window.location.search).get('id');
  var p = TumarData.byId(id);

  if (!p) {
    root.innerHTML =
      '<div class="wrap section">' +
        '<div class="empty">' +
          '<svg class="empty__mark" viewBox="0 0 56 50" aria-hidden="true"><path d="M28 3 53 47H3Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M28 20 38 38H18Z" fill="currentColor"/></svg>' +
          '<h1 class="h3">Такой вещи нет</h1>' +
          '<p>Возможно, ссылка устарела или модель сняли с продажи. Посмотрите, что есть в каталоге сейчас.</p>' +
          '<a class="btn btn--primary" href="catalog.html">В каталог</a>' +
        '</div>' +
      '</div>';
    document.title = 'Не найдено — ТҰМАР';
    U.init({ overlay: false });
    return;
  }

  var cat = TumarData.category(p.cat);
  var orn = TumarData.ornament(p.ornament);
  var label = p.type + ' «' + p.name + '»';
  var selected = { color: p.colors[0].id, size: null, image: 0 };
  var isLetterSizes = /^[A-Z]+$/.test(p.sizes[0]);

  document.title = label + ' — ТҰМАР';

  var gallery = p.img.map(function (src, i) {
    return { src: src, alt: label + (i === 0 ? ', фото на модели' : ', детали') };
  });

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  var monthly = Math.ceil(p.price / 12 / 100) * 100;

  root.innerHTML =
    '<div class="wrap">' +
      '<nav aria-label="Хлебные крошки" style="padding-top:28px">' +
        '<ol class="crumbs">' +
          '<li><a href="index.html">Главная</a></li>' +
          '<li><a href="catalog.html">Каталог</a></li>' +
          '<li><a href="catalog.html?cat=' + cat.id + '">' + cat.name + '</a></li>' +
          '<li aria-current="page">' + U.esc(p.name) + '</li>' +
        '</ol>' +
      '</nav>' +

      '<div class="pdp">' +
        /* Миниатюры нужны, только когда фото больше одного */
        '<div class="gallery' + (gallery.length > 1 ? '' : ' gallery--single') + '">' +
          (gallery.length > 1 ?
          '<div class="gallery__thumbs" role="group" aria-label="Фотографии товара">' +
            gallery.map(function (g, i) {
              return '<button type="button" class="gallery__thumb" data-thumb="' + i + '" aria-label="Фото ' + (i + 1) + ' из ' + gallery.length + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
                U.media(g.src, '', '', p.tint) + '</button>';
            }).join('') +
          '</div>' : '') +
          '<div class="gallery__main" data-main role="button" tabindex="0" aria-label="Увеличить фото">' +
            U.media(gallery[0].src, gallery[0].alt, label, p.tint, { eager: true }) +
          '</div>' +
        '</div>' +

        '<div class="pdp__info">' +
          '<div>' +
            '<span class="eyebrow">' + U.esc(p.type) + (p.handmade ? ' · Қолөнер' : '') + '</span>' +
            '<h1 class="pdp__title">' + U.esc(p.name) + '</h1>' +
            '<div class="pdp__rating">' + U.icon('star') + '<span class="num">' + p.rating.toFixed(1) + '</span>' +
              '<span aria-hidden="true">·</span><span>' + p.sold + ' ' + plural(p.sold, 'покупка', 'покупки', 'покупок') + '</span></div>' +
          '</div>' +

          '<div>' +
            '<div class="pdp__price">' + TumarData.price(p.price) + (p.oldPrice ? '<s>' + TumarData.price(p.oldPrice) + '</s>' : '') + '</div>' +
            '<div class="pdp__installment">Рассрочка на 12 месяцев · от ' + TumarData.price(monthly) + ' в месяц</div>' +
          '</div>' +

          '<p class="pdp__desc">' + U.esc(p.desc) + '</p>' +

          '<div class="opt">' +
            '<div class="opt__head"><span class="opt__label" id="color-label">Цвет<span data-color-name>' + U.esc(p.colors[0].name) + '</span></span></div>' +
            '<div class="swatches" role="radiogroup" aria-labelledby="color-label" data-colors>' +
              p.colors.map(function (c, i) {
                return '<button type="button" class="swatch" role="radio" data-color="' + c.id + '" aria-checked="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" aria-label="' + U.esc(c.name) + '" title="' + U.esc(c.name) + '" style="--sw:' + c.hex + '"><span></span></button>';
              }).join('') +
            '</div>' +
          '</div>' +

          '<div class="opt">' +
            '<div class="opt__head">' +
              '<span class="opt__label" id="size-label">Размер<span data-size-name></span></span>' +
              '<button type="button" class="text-btn" data-size-guide aria-haspopup="dialog">Таблица размеров</button>' +
            '</div>' +
            '<div class="sizes" role="radiogroup" aria-labelledby="size-label" aria-describedby="size-error" data-sizes>' +
              p.sizes.map(function (s, i) {
                return '<button type="button" class="size-btn" role="radio" data-size="' + U.esc(s) + '" aria-checked="false" tabindex="' + (i === 0 ? 0 : -1) + '">' + U.esc(s) + '</button>';
              }).join('') +
            '</div>' +
            '<p class="opt__error" id="size-error" aria-live="assertive" data-size-error></p>' +
          '</div>' +

          '<div class="pdp__buy">' +
            '<button type="button" class="btn btn--primary" data-add>' + U.icon('bag') + 'В корзину</button>' +
            '<button type="button" class="card__fav" data-fav="' + p.id + '" aria-pressed="' + TumarStore.isFav(p.id) + '" aria-label="' + (TumarStore.isFav(p.id) ? 'Убрать из избранного: ' : 'В избранное: ') + U.esc(label) + '">' + U.icon('heart') + '</button>' +
            '<button type="button" class="btn btn--ghost" data-buy-now style="grid-column:1/-1">Купить сейчас</button>' +
          '</div>' +

          '<ul class="perks">' +
            '<li>' + U.icon('truck') + 'Доставка по Казахстану 2–5 дней, бесплатно от 150 000 ₸</li>' +
            '<li>' + U.icon('swap') + 'Обмен размера в течение 14 дней</li>' +
            (p.handmade ? '<li>' + U.icon('needle') + 'Ручная вышивка — каждая вещь немного отличается</li>' : '<li>' + U.icon('home') + 'Пошито в мастерской в Шымкенте</li>') +
          '</ul>' +

          '<div>' +
            '<details class="acc" open><summary>Состав и уход' + U.icon('plus') + '</summary><div class="acc__body"><p>' + U.esc(p.fabric) + '</p><p>' + U.esc(p.care) + '</p></div></details>' +
            '<details class="acc"><summary>Доставка и оплата' + U.icon('plus') + '</summary><div class="acc__body"><p>По Казахстану — 2–5 рабочих дней курьером или в пункт выдачи. В Россию — 5–10 дней.</p><p>Оплата картой, Kaspi или при получении в бутиках Шымкента и Алматы.</p></div></details>' +
            '<details class="acc"><summary>Обмен и возврат' + U.icon('plus') + '</summary><div class="acc__body"><p>Обмен размера — 14 дней с момента получения, если сохранены бирки.</p><p>Вещи, сшитые под заказ, возврату не подлежат, но размер мы подгоним бесплатно.</p></div></details>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    (orn ?
    '<section class="section t-night grain" aria-labelledby="pdp-oyu-title">' +
      '<div class="wrap pdp-oyu">' +
        '<div class="oyu__figure">' + U.ornament(p.ornament, 'reveal-draw') + '</div>' +
        '<div>' +
          '<span class="eyebrow reveal">Ою-өрнек этой модели</span>' +
          '<h2 class="h2 reveal" id="pdp-oyu-title" style="--d:100ms;margin-top:14px">' + orn.name + '</h2>' +
          '<p class="oyu__ru reveal" style="--d:150ms;font-size:26px">' + orn.ru + '</p>' +
          '<p class="oyu__meaning reveal" style="--d:220ms">' + orn.meaning + '</p>' +
        '</div>' +
      '</div>' +
    '</section>' : '') +

    '<section class="section t-felt" aria-labelledby="related-title">' +
      '<div class="wrap">' +
        '<div class="section__head"><div><span class="eyebrow reveal">Сюда подойдёт</span>' +
        '<h2 class="h2 reveal" id="related-title" style="--d:100ms">Носят вместе</h2></div>' +
        '<a class="link-arrow reveal" href="catalog.html">Весь каталог ' + U.icon('arrowR') + '</a></div>' +
        '<div class="grid-products" data-related></div>' +
      '</div>' +
    '</section>';

  /* Похожие: сначала вещи другой категории, чтобы собрать образ, потом — той же */
  var related = TumarData.all()
    .filter(function (x) { return x.id !== p.id; })
    .sort(function (a, b) {
      var ka = (a.cat !== p.cat ? 0 : 1), kb = (b.cat !== p.cat ? 0 : 1);
      return (ka - kb) || (b.sold - a.sold);
    })
    .slice(0, 4);
  root.querySelector('[data-related]').innerHTML = related.map(U.card).join('');

  /* Модалка с таблицей размеров */
  var guide = document.createElement('div');
  guide.className = 'modal t-felt';
  guide.id = 'size-guide';
  guide.setAttribute('role', 'dialog');
  guide.setAttribute('aria-modal', 'true');
  guide.setAttribute('aria-labelledby', 'size-guide-title');
  var rows = isLetterSizes
    ? [['XS', '82–85', '64–67', '88–91', '40'], ['S', '86–89', '68–71', '92–95', '42'], ['M', '90–93', '72–75', '96–99', '44'],
       ['L', '94–97', '76–79', '100–103', '46'], ['XL', '98–102', '80–84', '104–108', '48'], ['XXL', '103–108', '85–90', '109–114', '50']]
        .filter(function (r) { return p.sizes.indexOf(r[0]) !== -1; })
    : p.sizes.map(function (s) { return [s, s + ' см']; });
  var head = isLetterSizes ? ['Размер', 'Грудь, см', 'Талия, см', 'Бёдра, см', 'RU'] : ['Размер', p.type === 'Белбеу' ? 'Длина по талии' : 'Обхват головы'];
  guide.innerHTML =
    '<div class="modal__head"><h2 class="h3" id="size-guide-title">Таблица размеров</h2>' +
      '<button type="button" class="icon-btn" aria-label="Закрыть таблицу размеров" data-close>' + U.icon('close') + '</button></div>' +
    '<p style="color:var(--muted);margin-bottom:16px">' + (isLetterSizes
      ? 'Если вы между двумя размерами — берите больший: шапаны и камзолы шьются со свободной посадкой.'
      : 'Измерьте мягкой сантиметровой лентой и выберите ближайшее значение.') + '</p>' +
    '<div class="table-wrap"><table class="size-table"><thead><tr>' + head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead>' +
    '<tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i ? '<td>' + c + '</td>' : '<th scope="row">' + c + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  document.body.appendChild(guide);

  /* Галерея -------------------------------------------------------------------- */
  var main = root.querySelector('[data-main]');

  function showImage(i) {
    selected.image = i;
    main.classList.remove('is-zoomed');
    main.innerHTML = U.media(gallery[i].src, gallery[i].alt, label, p.tint);
    U.hydrateImages(main);
    root.querySelectorAll('[data-thumb]').forEach(function (t, k) {
      if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-thumb]');
    if (t) showImage(Number(t.getAttribute('data-thumb')));
  });

  function toggleZoom(e) {
    var img = main.querySelector('img.is-loaded');
    if (!img) return;   /* зумить заглушку бессмысленно */
    if (e && e.clientX !== undefined && e.type === 'click') {
      var b = main.getBoundingClientRect();
      main.style.setProperty('--zx', ((e.clientX - b.left) / b.width * 100).toFixed(1) + '%');
      main.style.setProperty('--zy', ((e.clientY - b.top) / b.height * 100).toFixed(1) + '%');
    }
    main.classList.toggle('is-zoomed');
    main.setAttribute('aria-label', main.classList.contains('is-zoomed') ? 'Уменьшить фото' : 'Увеличить фото');
  }
  main.addEventListener('click', toggleZoom);
  main.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleZoom(e); }
  });
  main.addEventListener('mousemove', function (e) {
    if (!main.classList.contains('is-zoomed')) return;
    var b = main.getBoundingClientRect();
    main.style.setProperty('--zx', ((e.clientX - b.left) / b.width * 100).toFixed(1) + '%');
    main.style.setProperty('--zy', ((e.clientY - b.top) / b.height * 100).toFixed(1) + '%');
  });

  /* Радиогруппы: стрелки двигают выбор, Tab входит в группу одной остановкой (ARIA radiogroup) */
  function radioGroup(container, attr, onSelect) {
    var items = Array.prototype.slice.call(container.querySelectorAll('[' + attr + ']'));
    function select(btn, focus) {
      items.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-checked', on);
        b.setAttribute('tabindex', on ? 0 : -1);
      });
      if (focus) btn.focus();
      onSelect(btn.getAttribute(attr));
    }
    container.addEventListener('click', function (e) {
      var b = e.target.closest('[' + attr + ']');
      if (b) select(b, false);
    });
    container.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (i === -1) return;
      var next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!next) return;
      e.preventDefault();
      select(items[(i + next + items.length) % items.length], true);
    });
  }

  var sizeError = root.querySelector('[data-size-error]');
  var sizesEl = root.querySelector('[data-sizes]');

  radioGroup(root.querySelector('[data-colors]'), 'data-color', function (c) {
    selected.color = c;
    root.querySelector('[data-color-name]').textContent = p.colors.filter(function (x) { return x.id === c; })[0].name;
  });
  radioGroup(sizesEl, 'data-size', function (s) {
    selected.size = s;
    root.querySelector('[data-size-name]').textContent = s;
    sizeError.textContent = '';
  });

  function requireSize() {
    if (selected.size) return true;
    sizeError.textContent = 'Выберите размер — без него мы не знаем, что шить';
    sizesEl.classList.remove('is-shake');
    void sizesEl.offsetWidth;
    sizesEl.classList.add('is-shake');
    sizesEl.querySelector('[data-size]').focus();
    return false;
  }

  root.querySelector('[data-add]').addEventListener('click', function () {
    if (!requireSize()) return;
    TumarStore.add(p.id, selected.color, selected.size, 1);
    U.toast(label + ', ' + selected.size + ' — в корзине', true);
  });

  root.querySelector('[data-buy-now]').addEventListener('click', function (e) {
    if (!requireSize()) return;
    TumarStore.add(p.id, selected.color, selected.size, 1);
    document.querySelector('[data-open-cart]').click();
  });

  root.querySelector('[data-size-guide]').addEventListener('click', function (e) {
    U.openLayer(guide, e.currentTarget);
  });

  /* Телефон: закреплённая панель с ценой и «В корзину», пока основная кнопка вне экрана.
     На десктопе скрыта через CSS */
  var addBtn = root.querySelector('[data-add]');
  var buybar = document.createElement('div');
  buybar.className = 'buybar';
  buybar.setAttribute('aria-hidden', 'true');
  buybar.innerHTML =
    '<div class="buybar__price">' + TumarData.price(p.price) + '<small data-buybar-size>Выберите размер</small></div>' +
    '<button type="button" class="btn btn--primary" tabindex="-1">' + U.icon('bag') + 'В корзину</button>';
  document.body.appendChild(buybar);
  document.body.classList.add('has-buybar');

  buybar.querySelector('button').addEventListener('click', function () {
    if (!selected.size) {
      sizesEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(requireSize, 350);
      return;
    }
    addBtn.click();
  });
  sizesEl.addEventListener('click', function () {
    window.setTimeout(function () {
      buybar.querySelector('[data-buybar-size]').textContent = selected.size ? 'Размер ' + selected.size : 'Выберите размер';
    }, 0);
  });

  /* Панель — дубль основной кнопки для удобства пальца, поэтому скрыта от скринридера и Tab:
     доступная кнопка остаётся одна */
  /* По положению кнопки, а не через IntersectionObserver: тот молчит в фоновых вкладках и превью */
  var barTicking = false;
  function updateBuybar() {
    var b = addBtn.getBoundingClientRect();
    buybar.classList.toggle('is-on', b.bottom < 0 || b.top > window.innerHeight);
    barTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!barTicking) { barTicking = true; window.requestAnimationFrame(updateBuybar); }
  }, { passive: true });
  window.addEventListener('resize', updateBuybar);
  updateBuybar();

  U.init({ overlay: false });
})();
