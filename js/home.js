/* ТҰМАР — главная страница */
(function () {
  var U = TumarUI;

  /* Статичная часть рендерится до init, чтобы reveal-наблюдатель сразу увидел все узлы */

  document.querySelector('[data-trust]').innerHTML = [
    ['home', 'Пошив в Казахстане', 'Мастерская в Шымкенте, 12 мастериц'],
    ['needle', 'Ручная вышивка', 'Орнамент выбирают под смысл вещи'],
    ['truck', 'Доставка по КЗ и РФ', 'Бесплатно от 150 000 ₸'],
    ['swap', 'Обмен 14 дней', 'Если не подошёл размер — заменим']
  ].map(function (t, i) {
    return '<li class="trust__item reveal" style="--d:' + i * 90 + 'ms">' + U.icon(t[0]) +
      '<div><strong>' + t[1] + '</strong><span>' + t[2] + '</span></div></li>';
  }).join('');

  /* Обложка коллекции — фото самой продаваемой вещи категории. Фото вещей одной категории
     перечислены по убыванию продаж: если у первой фото ещё нет, браузер возьмёт следующее */
  document.querySelector('[data-collections]').innerHTML = TUMAR_CATEGORIES.map(function (c, i) {
    var items = TumarData.all().filter(function (p) { return p.cat === c.id; });
    var byPopularity = items.slice().sort(function (a, b) { return b.sold - a.sold; });
    var cover = byPopularity[0];
    return '<a class="collection reveal" href="catalog.html?cat=' + c.id + '" style="--d:' + i * 110 + 'ms">' +
      U.media(cover.img[0], '', '', cover.tint, { fallback: byPopularity.slice(1).map(function (p) { return p.img[0]; }) }) +
      '<span class="collection__count num">' + items.length + '</span>' +
      '<span class="collection__body"><span class="collection__name">' + c.name + '</span><span class="collection__ru">' + c.ru + '</span></span>' +
    '</a>';
  }).join('');

  document.querySelector('[data-big-marquee]').innerHTML =
    U.marquee(['Қошқар мүйіз', 'Түйе табан', 'Су', 'Ботакөз', 'Қорғайтын киім'], true);

  /* Узоры — не последовательность, поэтому вместо номеров 01–04 правдивые данные:
     сколько моделей вышито узором, со ссылкой на них в каталоге */
  function models(n) {
    var m10 = n % 10, m100 = n % 100;
    return n + ' ' + (m10 === 1 && m100 !== 11 ? 'модель' : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? 'модели' : 'моделей');
  }
  document.querySelector('[data-oyu]').innerHTML = Object.keys(TUMAR_ORNAMENTS).map(function (key, i) {
    var o = TUMAR_ORNAMENTS[key];
    var n = TumarData.all().filter(function (p) { return p.ornament === key; }).length;
    return '<article class="oyu__item reveal" style="--d:' + i * 110 + 'ms">' +
      '<div class="oyu__figure">' + U.ornament(key, 'reveal-draw') + '</div>' +
      '<h3 class="oyu__name">' + o.name + '</h3>' +
      '<p class="oyu__ru">' + o.ru + '</p>' +
      '<p class="oyu__meaning">' + o.meaning + '</p>' +
      '<a class="oyu__num" href="catalog.html?q=' + encodeURIComponent(o.name) + '" style="margin-top:14px">' + models(n) + ' с этим узором' + U.icon('arrowR') + '</a>' +
    '</article>';
  }).join('');

  var best = TumarData.all().sort(function (a, b) { return b.sold - a.sold; }).slice(0, 4);
  document.querySelector('[data-bestsellers]').innerHTML = best.map(U.card).join('');

  /* Пока часть фотосета не сгенерирована, плитка берёт первую вещь из своего списка, у которой фото уже есть.
     Подпись и ссылка всегда от той вещи, чьё фото показано. Когда фото появятся, раскладка станет исходной сама */
  function hasImage(p) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(im.naturalWidth > 0); };
      im.onerror = function () { resolve(false); };
      im.src = p.img[0];
    });
  }
  function firstWithImage(ids) {
    var list = ids.map(TumarData.byId).filter(Boolean);
    return Promise.all(list.map(hasImage)).then(function (ok) {
      for (var i = 0; i < list.length; i++) if (ok[i]) return list[i];
      return list[0];
    });
  }

  var lookTiles = [
    ['shapan-qys', 'shapan-zhauhar'],
    ['shapan-batyr', 'kamzol-er'],
    ['koilek-anar', 'koilek-arai', 'kamzol-kumis'],
    ['borik-tulki', 'taqiya-oyu']
  ];
  var lookEl = document.querySelector('[data-lookbook]');
  Promise.all(lookTiles.map(firstWithImage)).then(function (items) {
    lookEl.innerHTML = items.map(function (p, i) {
      var label = p.type + ' «' + p.name + '»';
      return '<figure class="reveal" style="--d:' + i * 100 + 'ms">' +
        U.media(p.img[0], label, label, p.tint) +
        '<figcaption>' + label + '</figcaption>' +
        '<a class="lookbook__link" href="product.html?id=' + p.id + '" aria-label="Открыть: ' + label + '"></a>' +
      '</figure>';
    }).join('');
    U.hydrateImages(lookEl);
    U.observe(lookEl);
  });

  /* Отзывы */
  var reviews = [
    ['Носила «Күміс» поверх платья на свадьбу сестры, а потом ещё полгода на работу. Вышивка за это время ни одной ниткой не поехала.', 'Айгерим', 'Алматы · камзол «Күміс»'],
    ['Искал шапан, в котором не стыдно и в городе, и на тое. «Батыр» — ровно такой: строгий, тёплый, орнамент только по бортам.', 'Ерлан', 'Шымкент · шапан «Батыр»'],
    ['Взяла «Қыс» с лисьим воротником на зимний той. Шили три недели и прислали фото вышивки на середине работы. Это было очень трогательно.', 'Дана', 'Астана · шапан «Қыс»']
  ];
  var rv = document.querySelector('[data-reviews]');
  rv.innerHTML =
    '<div class="reviews__viewport" aria-roledescription="карусель" aria-label="Отзывы">' +
      '<div class="reviews__track">' + reviews.map(function (r, i) {
        return '<div class="review" role="group" aria-roledescription="слайд" aria-label="' + (i + 1) + ' из ' + reviews.length + '"' + (i ? ' aria-hidden="true"' : '') + '>' +
          '<div class="review__inner">' +
            '<div class="review__stars" aria-label="Оценка 5 из 5">' + [1, 2, 3, 4, 5].map(function () { return U.icon('star'); }).join('') + '</div>' +
            '<blockquote class="review__text">«' + r[0] + '»</blockquote>' +
            '<div class="review__author">' + r[1] + '</div><div class="review__meta">' + r[2] + '</div>' +
          '</div></div>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="reviews__nav">' +
      '<button type="button" class="reviews__arrow" data-rv="-1" aria-label="Предыдущий отзыв">' + U.icon('arrowL') + '</button>' +
      '<div class="reviews__dots">' + reviews.map(function (_, i) {
        return '<button type="button" class="reviews__dot" data-rv-go="' + i + '" aria-label="Отзыв ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '></button>';
      }).join('') + '</div>' +
      '<button type="button" class="reviews__arrow" data-rv="1" aria-label="Следующий отзыв">' + U.icon('arrowR') + '</button>' +
    '</div>';

  var rvIndex = 0, rvTimer = null;
  function rvGo(i) {
    rvIndex = (i + reviews.length) % reviews.length;
    rv.querySelector('.reviews__track').style.transform = 'translateX(' + (-100 * rvIndex) + '%)';
    rv.querySelectorAll('.review').forEach(function (s, k) {
      if (k === rvIndex) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
    rv.querySelectorAll('[data-rv-go]').forEach(function (d, k) {
      if (k === rvIndex) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
    });
  }
  function rvAuto() {
    window.clearInterval(rvTimer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rvTimer = window.setInterval(function () { rvGo(rvIndex + 1); }, 7000);
    }
  }
  rv.addEventListener('click', function (e) {
    var a = e.target.closest('[data-rv]');
    var d = e.target.closest('[data-rv-go]');
    if (a) rvGo(rvIndex + Number(a.getAttribute('data-rv')));
    if (d) rvGo(Number(d.getAttribute('data-rv-go')));
    if (a || d) rvAuto();
  });
  /* Пауза автопрокрутки, пока пользователь взаимодействует */
  rv.addEventListener('mouseenter', function () { window.clearInterval(rvTimer); });
  rv.addEventListener('mouseleave', rvAuto);
  rv.addEventListener('focusin', function () { window.clearInterval(rvTimer); });
  rvAuto();

  /* Подписка — ошибка рядом с полем, проверка после ухода из поля (ux-guidelines) */
  var form = document.querySelector('[data-subscribe]');
  var email = form.querySelector('input');
  var hint = form.querySelector('#sub-hint');
  var defaultHint = hint.textContent;
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  function setHint(text, state) {
    hint.textContent = text;
    hint.className = 'field__hint' + (state ? ' is-' + state : '');
    email.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
  }
  email.addEventListener('blur', function () {
    if (email.value && !validEmail(email.value)) setHint('Проверьте адрес: не хватает @ или домена', 'error');
  });
  email.addEventListener('input', function () {
    if (email.getAttribute('aria-invalid') === 'true' && validEmail(email.value)) setHint(defaultHint);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validEmail(email.value)) {
      setHint(email.value ? 'Проверьте адрес: не хватает @ или домена' : 'Введите почту, чтобы подписаться', 'error');
      email.focus();
      return;
    }
    setHint('Рахмет! Письмо о новой коллекции придёт первым.', 'ok');
    email.value = '';
  });

  U.init({ overlay: true, current: '' });
  U.parallax(document.querySelector('[data-parallax]'), 0.18);

  /* Первый экран — статичное фото. Видео пробовали 17.09, пользователю не подошло;
     ролик лежит в source-img/video/hero.mp4, если решим вернуть. */

  /* Счётчики в блоке «О бренде» */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var nums = document.querySelectorAll('[data-count]');
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = Number(el.getAttribute('data-count')), start = null;
        function step(ts) {
          if (!start) start = ts;
          var k = Math.min(1, (ts - start) / 1400);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) window.requestAnimationFrame(step);
        }
        el.textContent = '0';
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cio.observe(n); });
  }
})();
