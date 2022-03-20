const getRandomInRangeInt = (rangeFrom, rangeTo) => {
  if (rangeFrom >= 0 && rangeFrom <= rangeTo) {
    return Math.round(rangeFrom + (Math.random() * (rangeTo - rangeFrom)));
  }
  return null;
};

const getRandomInRangeFloat = (rangeFrom, rangeTo, accuracy) => {
  if (rangeFrom >= 0 && rangeFrom <= rangeTo && accuracy >= 0) {
    return (rangeFrom + (Math.random() * (rangeTo - rangeFrom))).toFixed(accuracy);
  }
  return null;
};

getRandomInRangeInt(0, 10);
getRandomInRangeFloat(0, 100, 4);

// Перечислимые значения для генереции характеристик мокапов
const TIMES = ['12:00', '13:00', '14:00'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];

const LAT_RANGE = {MIN: 35.65000, MAX: 35.70000}; // диапазон широты
const LNG_RANGE = {MIN: 139.70000, MAX: 139.80000}; // диапазон долготы
const ACCURACY = 5; //точность координат в знаках после запятой

const ADV_COUNT = {length: 10}; //количество генерируемых объявлений

// Массив объектов недвижимости, указаны фиксированные заголовки и описания для соответствия типу объекта
const realEstateObjects = [
  {
    title: 'Спасская башня',
    type: 'palace',
    description: 'Сдам башню в центре Мск, красивый дид, рядом с метро Охотный ряд, соседи тихие, охрана, консьерж, есть часы на стене.',
  },
  {
    title: 'Двушка в центре',
    type: 'flat',
    description: 'Сдается Евро-двушка, от метро Саларьево. После Евроремонта, красивый вид в сторону ТЦ Саларис.',
  },
  {
    title: 'Домик у реки',
    type: 'house',
    description: 'Сдается уютный двухэтажный дом в живописном месте. В доме есть все необходимое для комфортного проживания: мебель, бытовая техника.',
  },
  {
    title: 'Чулан под лестницей, недорого',
    type: 'bungalow',
    description: 'Сдам чулан в пятикомнатной квартире в отличном состоянии в центре города на длительный срок, пешая доступность до метро Краснопресненская.',
  },
  {
    title: 'Аппартаменты от застройщика',
    type: 'hotel',
    description: 'Предлагаем Вашему вниманию уникальную, просторную многокомнатную квартиру для большой семьи в элитном ЖК "Баррин Хаус".',
  }
];

const getMockRealEstate = () => realEstateObjects[getRandomInRangeInt(0, realEstateObjects.length - 1)]; // Выбор случайного объекта из массива

// Для динамической генерации объектов с заданной структурой используем конструкторы
// пока они будут вызываться в текущем контексте, думаю, некоторые параметры не нужны
function MockAuthor() {
  this.avatar = `img/avatars/user${getRandomInRangeInt(1, 10)}.png`;
}

function MockLocation() {
  this.lat = getRandomInRangeFloat(LAT_RANGE.MIN, LAT_RANGE.MAX, ACCURACY);
  this.lng = getRandomInRangeFloat(LNG_RANGE.MIN, LNG_RANGE.MAX, ACCURACY);
}

function MockOffer(estate, location) {
  this.title = estate.title;
  this.address = `${location.lat}, ${location.lng}`;
  this.price = getRandomInRangeInt(10, 100) * 1000;
  this.type = estate.type;
  this.rooms = getRandomInRangeInt(1, 5);
  this.guests = getRandomInRangeInt(1, 8);
  this.checkin = TIMES[getRandomInRangeInt(0, TIMES.length - 1)];
  this.checkout = TIMES[getRandomInRangeInt(0, TIMES.length - 1)];
  this.features = FEATURES.filter(() => getRandomInRangeInt(0, 1));
  this.description = estate.description;
  this.photos = PHOTOS.filter(() => getRandomInRangeInt(0, 1));
}

function Advertesment() {
  this.author = new MockAuthor();
  this.location = new MockLocation();
  this.offer = new MockOffer(getMockRealEstate(), this.location);
}

const advertesments = Array.from(ADV_COUNT, () => new Advertesment()); // Итоговый массив в соответствии с заданием
advertesments.forEach(()=>{}); // Делаю что-то с массивом, чтобы не ругался линтер
