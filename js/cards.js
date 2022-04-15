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
  // Элементы с простым содержимым заполняются однообразно, выносим в отдельную функцию
  const fillCardElement = (cssSelector, content, isNotEmpty = true) => {
    if (content && isNotEmpty) {
      newCard.querySelector(cssSelector).textContent = content;
    } else {
      newCard.querySelector(cssSelector).classList.add('hidden');
    }
  };
  fillCardElement('.popup__title', offer.title);
  fillCardElement('.popup__text--address', offer.address);
  fillCardElement('.popup__text--price', `${offer.price} ₽/ночь`, offer.price);
  fillCardElement('.popup__type', TYPES[offer.type], offer.type);
  fillCardElement('.popup__text--capacity', getCapacityText(offer), offer.rooms && offer.guests);
  fillCardElement('.popup__text--time', `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`, offer.checkin && offer.checkout);
  fillCardElement('.popup__description', offer.description);

  // Элементы "аватар", "удобства" и "фото" требуют индивидуального наполнения
  if (author.avatar) {
    newCard.querySelector('.popup__avatar').src = author.avatar;
  } else {
    newCard.querySelector('.popup__avatar').classList.add('hidden');
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
