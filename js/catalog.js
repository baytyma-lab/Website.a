/* ТҰМАР — каталог.
   Всё состояние фильтров живёт в URL: ссылку можно переслать, F5 ничего не сбрасывает. */
(function () {
  var U = TumarUI;
  var ALL = TumarData.all();
  var BOUNDS = TumarData.priceBounds();
  var SIZES = TumarData.allSizes();
  var COLORS = TumarData.allColors();
  var GENDERS = [
    { id: 'women', name: 'Для неё' },
    { id: 'men', name: 'Для него' },
    { id: 'unisex', name: 'Унисекс' }
  ];
  var SORTS = ['popular', 'new', 'price-asc', 'price-desc', 'rating'];

  var els = {
    filters: document.getElementById('filters'),
    filtersBody: document.querySelector('[data-filters]'),
    grid: document.querySelector('[data-grid]'),
    chips: document.querySelector('[data-chips]'),
    count: document.querySelector('[data-count]'),
    sort: document.querySelector('[data-sort]'),
    q: document.querySelector('[data-q]'),
    title: document.querySelector('[data-title]'),
    subtitle: document.querySelector('[data-subtitle]'),
    crumb: document.querySelector('[data-crumb]'),
    activeCount: document.querySelector('[data-active-count]'),
    apply: document.querySelector('[data-apply]')
  };

  /* Фильтры на десктопе — обычная боковая панель, диалогом становятся только в bottom-sheet */
  els.filters.removeAttribute('role');
  els.filters.removeAttribute('aria-modal');

  /* URL ⇄ состояние ------------------------------------------------------------ */
  function list(params, key) {
    var v = params.get(key);
    return v ? v.split(',').filter(Boolean) : [];
  }

  function readState() {
    var p = new URLSearchParams(window.location.search);
    var min = Number(p.get('min')), max = Number(p.get('max'));
    return {
      cat: list(p, 'cat').filter(function (c) { return TumarData.category(c); }),
      size: list(p, 'size').filter(function (s) { return SIZES.indexOf(s) !== -1; }),
      color: list(p, 'color').filter(function (c) { return COLORS.some(function (x) { return x.id === c; }); }),
      gender: list(p, 'gender').filter(function (g) { return GENDERS.some(function (x) { return x.id === g; }); }),
      min: min >= BOUNDS.min && min <= BOUNDS.max ? min : BOUNDS.min,
      max: max >= BOUNDS.min && max <= BOUNDS.max ? max : BOUNDS.max,
      hand: p.get('hand') === '1',
      fav: p.get('fav') === '1',
      q: (p.get('q') || '').slice(0, 60),
      sort: SORTS.indexOf(p.get('sort')) !== -1 ? p.get('sort') : 'popular'
    };
  }

  function writeState() {
    var p = new URLSearchParams();
    if (state.cat.length) p.set('cat', state.cat.join(','));
    if (state.size.length) p.set('size', state.size.join(','));
    if (state.color.length) p.set('color', state.color.join(','));
    if (state.gender.length) p.set('gender', state.gender.join(','));
    if (state.min > BOUNDS.min) p.set('min', state.min);
    if (state.max < BOUNDS.max) p.set('max', state.max);
    if (state.hand) p.set('hand', '1');
    if (state.fav) p.set('fav', '1');
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'popular') p.set('sort', state.sort);
    var qs = p.toString();
    /* replaceState: фильтр не должен забивать историю «назад» десятком шагов.
       В песочнице (превью, Artifact) может бросить SecurityError — фильтры обязаны работать и без URL */
    try {
      window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
    } catch (e) { /* состояние живёт в памяти страницы */ }
  }

  var state = readState();

  /* Фильтрация ------------------------------------------------------------------ */
  function norm(s) { return String(s).toLowerCase().replace(/ё/g, 'е'); }

  /* skip — какой фасет не учитывать: так считаются честные счётчики у вариантов фильтра */
  function matches(p, s, skip) {
    if (skip !== 'cat' && s.cat.length && s.cat.indexOf(p.cat) === -1) return false;
    if (skip !== 'gender' && s.gender.length && s.gender.indexOf(p.gender) === -1) return false;
    if (skip !== 'size' && s.size.length && !p.sizes.some(function (x) { return s.size.indexOf(x) !== -1; })) return false;
    if (skip !== 'color' && s.color.length && !p.colors.some(function (c) { return s.color.indexOf(c.id) !== -1; })) return false;
    if (skip !== 'hand' && s.hand && !p.handmade) return false;
    if (p.price < s.min || p.price > s.max) return false;
    if (s.fav && !TumarStore.isFav(p.id)) return false;
    if (s.q) {
      var o = TumarData.ornament(p.ornament);
      var hay = norm([p.name, p.type, p.desc, o ? o.name + ' ' + o.ru : '', p.colors.map(function (c) { return c.name; }).join(' ')].join(' '));
      if (norm(s.q).split(/\s+/).some(function (w) { return w && hay.indexOf(w) === -1; })) return false;
    }
    return true;
  }

  function sorted(items) {
    var by = {
      'popular': function (a, b) { return b.sold - a.sold; },
      'new': function (a, b) { return (b.isNew - a.isNew) || (b.sold - a.sold); },
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      'rating': function (a, b) { return (b.rating - a.rating) || (b.sold - a.sold); }
    }[state.sort];
    return items.slice().sort(by);
  }

  function countFor(facet, test) {
    return ALL.filter(function (p) { return matches(p, state, facet) && test(p); }).length;
  }

  /* Разметка фильтров — один раз; дальше обновляются только отметки и счётчики -------- */
  var chevron = U.icon('chevron');
  var checkSvg = U.icon('check');

  function group(id, title, body, open) {
    return '<details class="fgroup"' + (open ? ' open' : '') + ' data-group="' + id + '">' +
      '<summary>' + title + chevron + '</summary><div class="fgroup__body">' + body + '</div></details>';
  }

  function checkRow(name, value, label) {
    var id = 'f-' + name + '-' + value;
    return '<label class="check" for="' + id + '">' +
      '<input type="checkbox" id="' + id + '" data-filter="' + name + '" value="' + value + '">' +
      '<span class="check__box">' + checkSvg + '</span>' + label +
      '<span class="check__count" data-count-for="' + name + ':' + value + '"></span>' +
    '</label>';
  }

  els.filtersBody.innerHTML =
    group('cat', 'Категория', TUMAR_CATEGORIES.map(function (c) { return checkRow('cat', c.id, c.name); }).join(''), true) +
    group('size', 'Размер', '<div class="sizes" role="group" aria-label="Размер">' + SIZES.map(function (s) {
      return '<button type="button" class="size-btn" data-filter-btn="size" data-value="' + s + '" aria-pressed="false">' + s + '</button>';
    }).join('') + '</div>', true) +
    group('color', 'Цвет', '<div class="swatches" role="group" aria-label="Цвет">' + COLORS.map(function (c) {
      return '<button type="button" class="swatch" data-filter-btn="color" data-value="' + c.id + '" aria-pressed="false" aria-label="' + c.name + '" title="' + c.name + '" style="--sw:' + c.hex + '"><span></span></button>';
    }).join('') + '</div>', true) +
    group('price', 'Цена',
      '<div class="range__values"><span data-min-label></span><span data-max-label></span></div>' +
      '<div class="range">' +
        '<div class="range__rail"></div><div class="range__fill" data-fill></div>' +
        '<label class="sr-only" for="price-min">Цена от</label>' +
        '<input type="range" id="price-min" min="' + BOUNDS.min + '" max="' + BOUNDS.max + '" step="1000" data-range="min">' +
        '<label class="sr-only" for="price-max">Цена до</label>' +
        '<input type="range" id="price-max" min="' + BOUNDS.min + '" max="' + BOUNDS.max + '" step="1000" data-range="max">' +
      '</div>', true) +
    group('hand', 'Особенности', checkRow('hand', '1', 'Ручная вышивка · Қолөнер'), true) +
    group('gender', 'Для кого', GENDERS.map(function (g) { return checkRow('gender', g.id, g.name); }).join(''), false);

  var rangeMin = els.filtersBody.querySelector('[data-range="min"]');
  var rangeMax = els.filtersBody.querySelector('[data-range="max"]');

  function syncControls() {
    els.filtersBody.querySelectorAll('[data-filter]').forEach(function (input) {
      var name = input.getAttribute('data-filter');
      input.checked = name === 'hand' ? state.hand : state[name].indexOf(input.value) !== -1;
    });
    els.filtersBody.querySelectorAll('[data-filter-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', state[b.getAttribute('data-filter-btn')].indexOf(b.getAttribute('data-value')) !== -1);
    });
    rangeMin.value = state.min;
    rangeMax.value = state.max;
    paintRange();
    els.sort.value = state.sort;
    if (document.activeElement !== els.q) els.q.value = state.q;
  }

  function paintRange() {
    var span = BOUNDS.max - BOUNDS.min;
    var a = (state.min - BOUNDS.min) / span * 100;
    var b = (state.max - BOUNDS.min) / span * 100;
    var fill = els.filtersBody.querySelector('[data-fill]');
    fill.style.left = a + '%';
    fill.style.right = (100 - b) + '%';
    els.filtersBody.querySelector('[data-min-label]').textContent = TumarData.price(state.min);
    els.filtersBody.querySelector('[data-max-label]').textContent = TumarData.price(state.max);
    rangeMin.setAttribute('aria-valuetext', TumarData.price(state.min));
    rangeMax.setAttribute('aria-valuetext', TumarData.price(state.max));
  }

  function updateCounts() {
    TUMAR_CATEGORIES.forEach(function (c) {
      set('cat:' + c.id, countFor('cat', function (p) { return p.cat === c.id; }));
    });
    GENDERS.forEach(function (g) {
      set('gender:' + g.id, countFor('gender', function (p) { return p.gender === g.id; }));
    });
    set('hand:1', countFor('hand', function (p) { return p.handmade; }));
    /* Размер или цвет, которые при текущих фильтрах ничего не дадут, приглушаются, но не блокируются */
    els.filtersBody.querySelectorAll('[data-filter-btn]').forEach(function (b) {
      var facet = b.getAttribute('data-filter-btn'), v = b.getAttribute('data-value');
      var n = countFor(facet, function (p) {
        return facet === 'size' ? p.sizes.indexOf(v) !== -1 : p.colors.some(function (c) { return c.id === v; });
      });
      b.style.opacity = n || b.getAttribute('aria-pressed') === 'true' ? '' : '.4';
    });
    function set(key, n) {
      var el = els.filtersBody.querySelector('[data-count-for="' + key + '"]');
      if (el) el.textContent = n;
    }
  }

  /* Чипы активных фильтров ------------------------------------------------------ */
  function chipsData() {
    var out = [];
    state.cat.forEach(function (c) { out.push({ label: TumarData.category(c).name, key: 'cat', value: c }); });
    state.size.forEach(function (s) { out.push({ label: 'Размер ' + s, key: 'size', value: s }); });
    state.color.forEach(function (c) {
      var col = COLORS.filter(function (x) { return x.id === c; })[0];
      out.push({ label: col.name, key: 'color', value: c });
    });
    state.gender.forEach(function (g) {
      out.push({ label: GENDERS.filter(function (x) { return x.id === g; })[0].name, key: 'gender', value: g });
    });
    if (state.min > BOUNDS.min || state.max < BOUNDS.max) {
      out.push({ label: TumarData.price(state.min) + ' — ' + TumarData.price(state.max), key: 'price' });
    }
    if (state.hand) out.push({ label: 'Ручная вышивка', key: 'hand' });
    if (state.fav) out.push({ label: 'Избранное', key: 'fav' });
    if (state.q) out.push({ label: '«' + state.q + '»', key: 'q' });
    return out;
  }

  function renderChips(data) {
    if (!data.length) { els.chips.innerHTML = ''; return; }
    els.chips.innerHTML = data.map(function (c) {
      return '<span class="chip">' + U.esc(c.label) +
        '<button type="button" data-chip="' + c.key + '"' + (c.value ? ' data-value="' + c.value + '"' : '') + ' aria-label="Убрать фильтр: ' + U.esc(c.label) + '">' + U.icon('close') + '</button>' +
      '</span>';
    }).join('') + (data.length > 1 ? '<button type="button" class="chip chip--clear" data-reset>Сбросить всё</button>' : '');
  }

  /* Рендер ------------------------------------------------------------------------ */
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function renderHead() {
    var single = state.cat.length === 1 ? TumarData.category(state.cat[0]) : null;
    var title = state.fav ? 'Избранное' : single ? single.name : 'Каталог';
    els.title.textContent = title;
    els.crumb.textContent = title;
    els.subtitle.textContent = state.fav
      ? 'Вещи, которые вы отметили сердцем. Список хранится в этом браузере.'
      : single ? single.ru + '. Ручная вышивка, пошив в Казахстане.'
      : 'Современная казахская одежда с ручной вышивкой. Каждую вещь можно отфильтровать по размеру, цвету и смыслу узора.';
    document.title = title + ' — ТҰМАР';
  }

  var firstRender = true;

  function render() {
    var items = sorted(ALL.filter(function (p) { return matches(p, state); }));
    var chips = chipsData();

    renderHead();
    syncControls();
    updateCounts();
    renderChips(chips);

    els.count.innerHTML = 'Найдено <strong>' + items.length + '</strong> ' + plural(items.length, 'товар', 'товара', 'товаров');
    els.activeCount.textContent = chips.length ? '(' + chips.length + ')' : '';
    els.apply.textContent = 'Показать ' + items.length;

    if (!items.length) {
      els.grid.innerHTML =
        '<div class="empty" style="grid-column:1/-1">' +
          '<svg class="empty__mark" viewBox="0 0 56 50" aria-hidden="true"><path d="M28 3 53 47H3Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M28 20 38 38H18Z" fill="currentColor"/></svg>' +
          '<h3 class="h3">' + (state.fav ? 'В избранном пока пусто' : 'Ничего не нашлось') + '</h3>' +
          '<p>' + (state.fav
            ? 'Нажмите на сердце у любой вещи — она появится здесь.'
            : 'Под такое сочетание фильтров вещей нет. Уберите один из фильтров выше или начните заново.') + '</p>' +
          '<button type="button" class="btn btn--primary" data-reset>' + (state.fav ? 'Смотреть весь каталог' : 'Сбросить фильтры') + '</button>' +
        '</div>';
    } else {
      els.grid.innerHTML = items.map(U.card).join('');
    }

    /* Короткая обратная связь при смене фильтров; при первом рендере — обычное появление */
    if (!firstRender) {
      els.grid.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('is-in'); });
      els.grid.classList.add('is-updating');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { els.grid.classList.remove('is-updating'); });
      });
    }
    U.hydrateImages(els.grid);
    U.observe(els.grid);
    firstRender = false;
  }

  function update(mutator) {
    mutator(state);
    writeState();
    render();
  }

  /* События ------------------------------------------------------------------------ */
  els.filtersBody.addEventListener('change', function (e) {
    var input = e.target.closest('[data-filter]');
    if (!input) return;
    var name = input.getAttribute('data-filter');
    update(function (s) {
      if (name === 'hand') { s.hand = input.checked; return; }
      var i = s[name].indexOf(input.value);
      if (input.checked && i === -1) s[name].push(input.value);
      if (!input.checked && i !== -1) s[name].splice(i, 1);
    });
  });

  els.filtersBody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter-btn]');
    if (!b) return;
    var facet = b.getAttribute('data-filter-btn'), v = b.getAttribute('data-value');
    update(function (s) {
      var i = s[facet].indexOf(v);
      if (i === -1) s[facet].push(v); else s[facet].splice(i, 1);
    });
  });

  /* Ползунки: при перетаскивании обновляем подписи сразу, а выдачу — с небольшой задержкой */
  var rangeTimer = null;
  function onRange(e) {
    var isMin = e.target === rangeMin;
    var a = Number(rangeMin.value), b = Number(rangeMax.value);
    if (a > b) { if (isMin) a = b; else b = a; }
    state.min = a; state.max = b;
    rangeMin.value = a; rangeMax.value = b;
    paintRange();
    window.clearTimeout(rangeTimer);
    rangeTimer = window.setTimeout(function () { update(function () {}); }, 180);
  }
  rangeMin.addEventListener('input', onRange);
  rangeMax.addEventListener('input', onRange);

  els.sort.addEventListener('change', function () {
    update(function (s) { s.sort = els.sort.value; });
  });

  var qTimer = null;
  els.q.addEventListener('input', function () {
    window.clearTimeout(qTimer);
    qTimer = window.setTimeout(function () {
      update(function (s) { s.q = els.q.value.trim().slice(0, 60); });
    }, 220);
  });

  function resetAll() {
    update(function (s) {
      s.cat = []; s.size = []; s.color = []; s.gender = [];
      s.min = BOUNDS.min; s.max = BOUNDS.max;
      s.hand = false; s.fav = false; s.q = '';
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset]')) { resetAll(); return; }
    var chip = e.target.closest('[data-chip]');
    if (chip) {
      var key = chip.getAttribute('data-chip'), v = chip.getAttribute('data-value');
      update(function (s) {
        if (key === 'price') { s.min = BOUNDS.min; s.max = BOUNDS.max; }
        else if (key === 'hand' || key === 'fav') s[key] = false;
        else if (key === 'q') s.q = '';
        else s[key].splice(s[key].indexOf(v), 1);
      });
      /* Фокус не должен пропасть вместе с удалённым чипом */
      var next = els.chips.querySelector('[data-chip]') || els.sort;
      next.focus({ preventScroll: true });
      return;
    }
    var open = e.target.closest('[data-open-filters]');
    if (open) {
      els.filters.setAttribute('role', 'dialog');
      els.filters.setAttribute('aria-modal', 'true');
      U.openLayer(els.filters, open);
    }
  });

  /* Снятие роли диалога после закрытия bottom-sheet */
  new MutationObserver(function () {
    if (!els.filters.classList.contains('is-open')) {
      els.filters.removeAttribute('role');
      els.filters.removeAttribute('aria-modal');
    }
  }).observe(els.filters, { attributes: true, attributeFilter: ['class'] });

  /* Избранное меняется из карточек — выдачу «Избранного» нужно пересобрать */
  document.addEventListener('tumar:change', function (e) {
    if (e.detail.type === 'fav' && state.fav) render();
  });

  U.init({ overlay: false, current: 'catalog' });
  writeState();   /* сразу очищаем URL от невалидных параметров из чужой ссылки */
  render();
})();
