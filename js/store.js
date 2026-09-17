/* ТҰМАР — корзина и избранное.
   localStorage может бросать исключение (приватный режим, превью, заблокированные данные сайта),
   поэтому каждое обращение обёрнуто, а при сбое состояние живёт в памяти до перезагрузки. */

var TumarStore = (function () {
  var CART_KEY = 'tumar.cart.v1';
  var FAV_KEY = 'tumar.fav.v1';
  var FREE_SHIPPING_FROM = 150000;
  var PROMOS = { 'TUMAR10': 0.10 };

  var memory = {};

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return memory[key] !== undefined ? memory[key] : fallback;
    }
  }

  function write(key, value) {
    memory[key] = value;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* остаёмся в памяти */ }
  }

  function emit(type) {
    document.dispatchEvent(new CustomEvent('tumar:change', { detail: { type: type } }));
  }

  /* Корзина хранит только ссылки на товар — цена и название всегда берутся из TumarData,
     поэтому устаревшая цена из старой сессии не попадёт в итог */
  function lineKey(id, color, size) { return id + '|' + color + '|' + size; }

  function cleanCart(items) {
    return items.filter(function (it) {
      var p = TumarData.byId(it.id);
      return p && p.sizes.indexOf(it.size) !== -1 && it.qty > 0;
    });
  }

  var api = {
    FREE_SHIPPING_FROM: FREE_SHIPPING_FROM,

    cart: function () { return cleanCart(read(CART_KEY, [])); },

    add: function (id, color, size, qty) {
      var items = api.cart();
      var key = lineKey(id, color, size);
      var found = null;
      items.forEach(function (it) { if (lineKey(it.id, it.color, it.size) === key) found = it; });
      if (found) found.qty = Math.min(found.qty + (qty || 1), 10);
      else items.push({ id: id, color: color, size: size, qty: qty || 1 });
      write(CART_KEY, items);
      emit('cart');
    },

    setQty: function (key, qty) {
      var items = api.cart().map(function (it) {
        if (lineKey(it.id, it.color, it.size) === key) it.qty = Math.max(0, Math.min(qty, 10));
        return it;
      }).filter(function (it) { return it.qty > 0; });
      write(CART_KEY, items);
      emit('cart');
    },

    remove: function (key) {
      write(CART_KEY, api.cart().filter(function (it) { return lineKey(it.id, it.color, it.size) !== key; }));
      emit('cart');
    },

    lineKey: lineKey,

    count: function () {
      return api.cart().reduce(function (n, it) { return n + it.qty; }, 0);
    },

    promo: function () { return read('tumar.promo.v1', null); },

    applyPromo: function (code) {
      var c = String(code || '').trim().toUpperCase();
      if (!PROMOS[c]) return false;
      write('tumar.promo.v1', c);
      emit('cart');
      return true;
    },

    totals: function () {
      var subtotal = api.cart().reduce(function (sum, it) {
        return sum + TumarData.byId(it.id).price * it.qty;
      }, 0);
      var code = api.promo();
      var discount = code && PROMOS[code] ? Math.round(subtotal * PROMOS[code]) : 0;
      var afterDiscount = subtotal - discount;
      var shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_FROM ? 0 : 3500;
      return {
        subtotal: subtotal,
        discount: discount,
        shipping: shipping,
        total: afterDiscount + shipping,
        toFree: Math.max(0, FREE_SHIPPING_FROM - afterDiscount)
      };
    },

    favs: function () { return read(FAV_KEY, []).filter(function (id) { return TumarData.byId(id); }); },

    isFav: function (id) { return api.favs().indexOf(id) !== -1; },

    toggleFav: function (id) {
      var f = api.favs();
      var i = f.indexOf(id);
      if (i === -1) f.push(id); else f.splice(i, 1);
      write(FAV_KEY, f);
      emit('fav');
      return i === -1;
    }
  };

  return api;
})();
