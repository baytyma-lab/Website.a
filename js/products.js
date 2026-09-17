/* ТҰМАР — данные каталога.
   Единственный источник правды для index / catalog / product.
   Никаких type="module": файл должен работать и по file://, и с сервера. */

var TUMAR_ORNAMENTS = {
  'qoshqar-muiz': {
    name: 'Қошқар мүйіз',
    ru: 'Бараньи рога',
    meaning: 'Самый частый узор казахского орнамента. Символ достатка, силы рода и приумножения — им покрывали то, что хотели сохранить и умножить.'
  },
  'tuye-taban': {
    name: 'Түйе табан',
    ru: 'Верблюжий след',
    meaning: 'Знак выносливости и долгой дороги. Его наносили на вещи, которые уходили с хозяином в путь и должны были вернуться вместе с ним.'
  },
  'su': {
    name: 'Су',
    ru: 'Вода',
    meaning: 'Текучая линия без начала и конца — жизнь и непрерывность поколений. В степи вода означала саму возможность жить.'
  },
  'botakoz': {
    name: 'Ботакөз',
    ru: 'Глаз верблюжонка',
    meaning: 'Оберег от дурного глаза. Его вышивали детям и молодым — тем, кого берегли больше всего.'
  }
};

/* «Көйлек» по-казахски — и платье, и рубашка, поэтому мужская жейде живёт в той же категории */
var TUMAR_CATEGORIES = [
  { id: 'shapan',   name: 'Шапан',        ru: 'Халаты на запах' },
  { id: 'kamzol',   name: 'Камзол',       ru: 'Бархатные жилеты' },
  { id: 'koilek',   name: 'Көйлек',       ru: 'Платья и рубашки' },
  { id: 'aksesuar', name: 'Бас киім',     ru: 'Уборы и украшения' }
];

var TUMAR_PRODUCTS = [
  /* ---------- Женская линия ---------- */
  {
    id: 'shapan-zhauhar', name: 'Жауһар', type: 'Шапан', cat: 'shapan',
    price: 215000, oldPrice: null, badge: 'Хит', gender: 'women',
    tint: '#1F4D3E', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'emerald', name: 'Изумруд', hex: '#1F4D3E' }, { id: 'bordo', name: 'Бордо', hex: '#5E1A22' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: ['img/shapan-zhauhar-1.jpg'],
    desc: 'Изумрудный бархатный шапан на запах с узким поясом. Крой традиционный — без плечевого шва, широкие рукава сужаются к обшлагу. По бортам и обшлагам идёт қошқар мүйіз золотой нитью.',
    fabric: 'Хлопковый бархат 100%. Подкладка — шёлк. Вышивка — металлизированная нить.',
    care: 'Только сухая чистка. Хранить на широких плечиках, ворсом не к стене.',
    rating: 4.9, sold: 184, isNew: false
  },
  {
    id: 'shapan-qys', name: 'Қыс', type: 'Шапан', cat: 'shapan',
    price: 289000, oldPrice: null, badge: 'Жаңа', gender: 'women',
    tint: '#5E1A22', ornament: 'tuye-taban', handmade: true,
    colors: [{ id: 'bordo', name: 'Бордо', hex: '#5E1A22' }],
    sizes: ['XS', 'S', 'M', 'L'],
    img: ['img/shapan-qys-1.jpg'],
    desc: 'Зимний шапан в пол из бордового бархата на стёганой подкладке. Воротник из меха лисы, по бортам — түйе табан серебряной нитью. Для зимнего тоя и морозного Наурыза.',
    fabric: 'Бархат 100%, утеплитель — верблюжья шерсть. Воротник — натуральный мех лисы.',
    care: 'Только сухая чистка в меховой химчистке. Мех не мочить.',
    rating: 5.0, sold: 42, isNew: true
  },
  {
    id: 'kamzol-kumis', name: 'Күміс', type: 'Камзол', cat: 'kamzol',
    price: 124000, oldPrice: null, badge: 'Хит', gender: 'women',
    tint: '#1E1A18', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'black', name: 'Қара', hex: '#1E1A18' }, { id: 'emerald', name: 'Изумруд', hex: '#1F4D3E' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: ['img/kamzol-kumis-1.jpg'],
    desc: 'Длинный приталенный камзол из чёрного бархата ниже бёдер. Ряд серебряных пуговиц и серебряная вышивка по полочкам. Надевается поверх көйлек — так носили камзол всегда.',
    fabric: 'Хлопковый бархат 100%. Пуговицы — мельхиор с серебрением.',
    care: 'Сухая чистка. Пуговицы полировать мягкой тканью.',
    rating: 4.9, sold: 231, isNew: false
  },
  {
    id: 'kamzol-aru', name: 'Ару', type: 'Камзол', cat: 'kamzol',
    price: 108000, oldPrice: 126000, badge: 'Скидка', gender: 'women',
    tint: '#E6DCC8', ornament: 'botakoz', handmade: true,
    colors: [{ id: 'ivory', name: 'Сүт', hex: '#E6DCC8' }],
    sizes: ['XS', 'S', 'M', 'L'],
    img: ['img/kamzol-aru-1.jpg'],
    desc: 'Короткий молочный камзол из бархата с золотой вышивкой ботакөз — оберегом, который вышивали молодым. Хорош на қыз ұзату и поверх гранатового көйлек.',
    fabric: 'Хлопковый бархат 100%. Вышивка — металлизированная нить.',
    care: 'Только сухая чистка.',
    rating: 4.8, sold: 97, isNew: false
  },
  {
    id: 'koilek-arai', name: 'Арай', type: 'Көйлек', cat: 'koilek',
    price: 146000, oldPrice: null, badge: null, gender: 'women',
    tint: '#E6DCC8', ornament: 'su', handmade: false,
    colors: [{ id: 'ivory', name: 'Сүт', hex: '#E6DCC8' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: ['img/koilek-arai-1.jpg'],
    desc: 'Молочное шёлковое платье в пол с воротником-стойкой. По подолу и рукавам — многоярусные оборки-желбір, как у праздничных көйлек начала XX века.',
    fabric: 'Натуральный шёлк 100%.',
    care: 'Ручная стирка в холодной воде или сухая чистка. Оборки гладить через ткань.',
    rating: 4.8, sold: 156, isNew: false
  },
  {
    id: 'koilek-anar', name: 'Анар', type: 'Көйлек', cat: 'koilek',
    price: 139000, oldPrice: null, badge: null, gender: 'women',
    tint: '#8E2430', ornament: 'qoshqar-muiz', handmade: false,
    colors: [{ id: 'garnet', name: 'Гранат', hex: '#8E2430' }, { id: 'ivory', name: 'Сүт', hex: '#E6DCC8' }],
    sizes: ['XS', 'S', 'M', 'L'],
    img: ['img/koilek-anar-1.jpg'],
    desc: 'Гранатовое платье из плотного шёлка: стойка, оборка по подолу, узкая полоса вышивки по вороту. Красный в степи носили молодые девушки — это цвет радости.',
    fabric: 'Натуральный шёлк 100%.',
    care: 'Сухая чистка. Гладить с изнанки.',
    rating: 4.9, sold: 118, isNew: true
  },

  /* ---------- Мужская линия ---------- */
  {
    id: 'shapan-batyr', name: 'Батыр', type: 'Шапан', cat: 'shapan',
    price: 235000, oldPrice: null, badge: null, gender: 'men',
    tint: '#1E1A18', ornament: 'tuye-taban', handmade: true,
    colors: [{ id: 'black', name: 'Қара', hex: '#1E1A18' }, { id: 'navy', name: 'Түнгі', hex: '#1E2A3E' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: ['img/shapan-batyr-1.jpg'],
    desc: 'Мужской шапан из чёрной шерсти, длиной ниже колена. Запах, открытый ворот, широкий рукав. Орнамент — одна бронзовая полоса по бортам и обшлагам: этника читается сдержанно, вещь носится и в городе.',
    fabric: 'Шерсть 90%, кашемир 10%. Подкладка — вискоза.',
    care: 'Сухая чистка. Проветривать после носки.',
    rating: 4.9, sold: 143, isNew: false
  },
  {
    id: 'kamzol-er', name: 'Ер', type: 'Камзол', cat: 'kamzol',
    price: 118000, oldPrice: null, badge: null, gender: 'men',
    tint: '#1E2A3E', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'navy', name: 'Түнгі', hex: '#1E2A3E' }, { id: 'black', name: 'Қара', hex: '#1E1A18' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: ['img/kamzol-er-1.jpg'],
    desc: 'Мужской камзол из тёмно-синего бархата с воротником-стойкой и серебряными пуговицами. Тонкая серебряная вышивка по краю полочек. Поверх жейде — готовый образ на той.',
    fabric: 'Хлопковый бархат 100%. Пуговицы — мельхиор с серебрением.',
    care: 'Сухая чистка.',
    rating: 4.8, sold: 88, isNew: false
  },
  {
    id: 'zheide-aq-zhol', name: 'Ақ жол', type: 'Жейде', cat: 'koilek',
    price: 58000, oldPrice: null, badge: null, gender: 'men',
    tint: '#E6DCC8', ornament: 'su', handmade: false,
    colors: [{ id: 'ivory', name: 'Сүт', hex: '#E6DCC8' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: ['img/zheide-aq-zhol-1.jpg'],
    desc: 'Мужская рубашка из плотного льна с воротником-стойкой. По планке — узкая вышивка «су» нитью в тон. Основа под камзол и шапан.',
    fabric: 'Лён 100%.',
    care: 'Машинная стирка 40°. Лён мнётся — это нормально.',
    rating: 4.7, sold: 121, isNew: false
  },

  /* ---------- Уборы и украшения ---------- */
  {
    id: 'borik-tulki', name: 'Түлкі', type: 'Бөрік', cat: 'aksesuar',
    price: 96000, oldPrice: null, badge: 'Жаңа', gender: 'unisex',
    tint: '#8A5A34', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'bordo', name: 'Бордо', hex: '#5E1A22' }, { id: 'black', name: 'Қара', hex: '#1E1A18' }],
    sizes: ['55', '57', '59', '61'],
    img: ['img/borik-tulki-1.jpg'],
    desc: 'Бөрік с бархатным верхом и широкой опушкой из рыжей лисы. Верх расшит серебряной нитью. Зимний убор, в котором степной образ собирается сам.',
    fabric: 'Бархат, натуральный мех лисы, подкладка — шёлк.',
    care: 'Меховая химчистка. Хранить на болванке, мех не прижимать.',
    rating: 5.0, sold: 188, isNew: true
  },
  {
    id: 'taqiya-oyu', name: 'Ою', type: 'Тақия', cat: 'aksesuar',
    price: 34000, oldPrice: null, badge: null, gender: 'unisex',
    tint: '#1E1A18', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'black', name: 'Қара', hex: '#1E1A18' }, { id: 'emerald', name: 'Изумруд', hex: '#1F4D3E' }],
    sizes: ['55', '57', '59', '61'],
    img: ['img/taqiya-oyu-1.jpg'],
    desc: 'Бархатная тақия с плоским верхом. По околышу — қошқар мүйіз серебряной нитью. Вышивка ручная, каждая тақия чуть отличается от соседней.',
    fabric: 'Бархат 100%. Вышивка — серебряная нить.',
    care: 'Сухая чистка. Хранить набитой бумагой, чтобы держала форму.',
    rating: 4.9, sold: 162, isNew: false
  },
  {
    id: 'belbeu-kumis', name: 'Күміс', type: 'Белбеу', cat: 'aksesuar',
    price: 52000, oldPrice: null, badge: 'Хит', gender: 'unisex',
    tint: '#4A3222', ornament: 'qoshqar-muiz', handmade: true,
    colors: [{ id: 'brown', name: 'Қоңыр', hex: '#4A3222' }, { id: 'black', name: 'Қара', hex: '#1E1A18' }],
    sizes: ['85', '90', '95', '100'],
    img: ['img/belbeu-kumis-1.jpg'],
    desc: 'Кожаный пояс с коваными серебряными бляхами и гравированной пряжкой. Пояс — центр казахского образа: им подпоясывают шапан и камзол.',
    fabric: 'Натуральная кожа. Бляхи — мельхиор с серебрением.',
    care: 'Протирать сухой тканью. Раз в сезон обрабатывать кремом для кожи.',
    rating: 5.0, sold: 109, isNew: false
  }
];

var TumarData = {
  all: function () { return TUMAR_PRODUCTS.slice(); },

  byId: function (id) {
    for (var i = 0; i < TUMAR_PRODUCTS.length; i++) {
      if (TUMAR_PRODUCTS[i].id === id) return TUMAR_PRODUCTS[i];
    }
    return null;
  },

  category: function (id) {
    for (var i = 0; i < TUMAR_CATEGORIES.length; i++) {
      if (TUMAR_CATEGORIES[i].id === id) return TUMAR_CATEGORIES[i];
    }
    return null;
  },

  ornament: function (key) { return TUMAR_ORNAMENTS[key] || null; },

  /* 189000 -> "189 000 ₸" с неразрывными пробелами, чтобы цена не рвалась на две строки */
  price: function (v) {
    return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
  },

  /* Буквенные размеры по порядку, числовые (уборы, белбеу) — по возрастанию, после буквенных */
  allSizes: function () {
    var order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    var seen = {}, out = [];
    TUMAR_PRODUCTS.forEach(function (p) {
      p.sizes.forEach(function (s) { if (!seen[s]) { seen[s] = true; out.push(s); } });
    });
    return out.sort(function (a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return Number(a) - Number(b);
    });
  },

  allColors: function () {
    var seen = {}, out = [];
    TUMAR_PRODUCTS.forEach(function (p) {
      p.colors.forEach(function (c) { if (!seen[c.id]) { seen[c.id] = true; out.push(c); } });
    });
    return out;
  },

  priceBounds: function () {
    var min = Infinity, max = 0;
    TUMAR_PRODUCTS.forEach(function (p) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    });
    return { min: Math.floor(min / 1000) * 1000, max: Math.ceil(max / 1000) * 1000 };
  }
};
