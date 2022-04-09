import { activateForm, setAddress } from './form.js';
import { createCard } from './cards.js';

// Настройки по умолчанию
const LOCATIONS = {
  TOKIO: { lat: 35.682507, lng: 139.752717 },
};
const INIT_SCALE = 13;
const PINS = {
  SPECIAL: { sizeXY: [52, 52], anchorXY: [26, 52], src: '../img/main-pin.svg' },
  SIMILAR: { sizeXY: [40, 40], anchorXY: [20, 40], src: '../img/pin.svg' },
};

// Инициализация карты
const map = L.map('map-canvas')
  .on('load', () => {
    activateForm();
  })
  .setView(LOCATIONS.TOKIO, INIT_SCALE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

// Созаем нужные иконки
const mainMarkerIcon = L.icon(
  {
    iconUrl: PINS.SPECIAL.src,
    iconSize: PINS.SPECIAL.sizeXY,
    iconAnchor: PINS.SPECIAL.anchorXY,
  }
);

const similarMarkerIcon = L.icon(
  {
    iconUrl: PINS.SIMILAR.src,
    iconSize: PINS.SIMILAR.sizeXY,
    iconAnchor: PINS.SIMILAR.anchorXY,
  }
);

// Создание основного маркера для заполенения поля адреса в форме
const mainMarker = L.marker(
  LOCATIONS.TOKIO,
  {
    draggable: 'true',
    icon: mainMarkerIcon,
  }
);

mainMarker.addTo(map);
setAddress(LOCATIONS.TOKIO);

mainMarker.on('move', (evt) => {
  setAddress(evt.target.getLatLng());
});

// Создаем слой, на котором будем отрисовывать маркеры объявлений
const similarMarkersGroup = L.layerGroup().addTo(map);

// Функция для маркера на основе входных данных объявления
const createSimilarMarker = (location, content) => {
  const similarMarker = L.marker(
    location,
    {
      draggable: false,
      icon: similarMarkerIcon,
    }
  );
  similarMarker.addTo(similarMarkersGroup);
  similarMarker.bindPopup(content);
};

///// Функции интерфейса модуля
// Переотрисовка на карте маркеров объявлений на основе массива данных
const showMarkers = (adsArray) => {
  similarMarkersGroup.clearLayers();
  adsArray.forEach((advert) => {
    createSimilarMarker(advert.location, createCard(advert));
  });
};

export { showMarkers };
