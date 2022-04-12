const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
const TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const getCapacityText = ({ rooms, guests }) => {
  let result = '';
  switch (rooms) {
    case 1:
    case 21:
      result = `${rooms} комната`;
      break;
    case 2:
    case 3:
    case 4:
      result = `${rooms} комнаты`;
      break;
    default:
      result = `${rooms} комнат`;
  }
  switch (guests) {
    case 1:
      result = `${result} для ${guests} гостя`;
      break;
    default:
      result = `${result} для ${guests} гостей`;
  }
  return result;
};

const getPhotosList = (photos, elementTemplate) => {
  const photosList = document.createDocumentFragment();
  photos.forEach((photo) => {
    const newPhoto = elementTemplate.cloneNode(false);
    newPhoto.src = photo;
    photosList.append(newPhoto);
  });
  return photosList;
};

// Теперь основная функция данного модуля - создание карточки из входных данных
const createCard = ({ author, offer }) => {
  const newCard = cardTemplate.cloneNode(true);
  if (offer.title) {
    newCard.querySelector('.popup__title').textContent = offer.title;
  } else {
    newCard.querySelector('.popup__title').classList.add('hidden');
  }
  if (author.avatar) {
    newCard.querySelector('.popup__avatar').src = author.avatar;
  } else {
    newCard.querySelector('.popup__avatar').classList.add('hidden');
  }
  if (offer.address) {
    newCard.querySelector('.popup__text--address').textContent = offer.address;
  } else {
    newCard.querySelector('.popup__text--address').classList.add('hidden');
  }
  if (offer.price) {
    newCard.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  }
  if (offer.type) {
    newCard.querySelector('.popup__type').textContent = TYPES[offer.type];
  } else {
    newCard.querySelector('.popup__type').classList.add('hidden');
  }
  if (offer.rooms && offer.guests) {
    newCard.querySelector('.popup__text--capacity').textContent = getCapacityText(offer);
  } else {
    newCard.querySelector('.popup__text--capacity').classList.add('hidden');
  }
  if (offer.checkin && offer.checkout) {
    newCard.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkin}`;
  } else {
    newCard.querySelector('.popup__text--time').classList.add('hidden');
  }
  if (offer.features) {
    const featuresList = document.createDocumentFragment();
    offer.features.forEach((feature) => {
      const newElement = document.createElement('li');
      newElement.classList.add('popup__feature', `popup__feature--${feature}`);
      featuresList.append(newElement);
    });
    newCard.querySelector('.popup__features').innerHTML = '';
    newCard.querySelector('.popup__features').append(featuresList);
  } else {
    newCard.querySelector('.popup__features').classList.add('hidden');
  }
  if (offer.description) {
    newCard.querySelector('.popup__description').textContent = offer.description;
  } else {
    newCard.querySelector('.popup__description').classList.add('hidden');
  }
  if (offer.photos) {
    const photosList = newCard.querySelector('.popup__photos');
    const photosFragment = getPhotosList(offer.photos, photosList.querySelector('img'));
    photosList.innerHTML = '';
    photosList.append(photosFragment);
  } else {
    newCard.querySelector('.popup__photos').classList.add('hidden');
  }
  return newCard;
};

export { createCard };
