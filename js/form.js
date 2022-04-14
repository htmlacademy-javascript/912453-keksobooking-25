import { sendFormData } from './data.js';

const form = document.querySelector('.ad-form');
const titleField = form.querySelector('#title');
const roomsField = form.querySelector('#room_number');
const capacityField = form.querySelector('#capacity');
const priceField = form.querySelector('#price');
const typeField = form.querySelector('#type');
const timeinField = form.querySelector('#timein');
const timeoutField = form.querySelector('#timeout');
const addressField = form.querySelector('#address');
const priceSlider = form.querySelector('.ad-form__slider');
const avatarPreview = form.querySelector('.ad-form-header__preview img');
const avatarFileChooser = form.querySelector('#avatar');
const photosPreviewElement = form.querySelector('.ad-form__photo');
const photosPreviewContainer = form.querySelector('.ad-form__photo-container');
const photosFileChooser = form.querySelector('#images');

const MIN_PRICES = {
  flat: 1000,
  bungalow: 0,
  house: 5000,
  palace: 10000,
  hotel: 3000,
};
const MAX_PRICE = 100000;
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const PHOTO_PREVIEWS = {
  COUNT: 10,
  STYLE: {
    width: '70px',
    height: '70px',
  },
};

// Превью аватарки пользователя в объявлении
avatarFileChooser.setAttribute('accept', 'image/png, image/jpeg');
avatarFileChooser.addEventListener('change', () => {
  const file = avatarFileChooser.files[0];
  const fileName = file.name.toLowerCase();

  if (FILE_TYPES.some((it) => fileName.endsWith(it))) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

const resetAvatarChooser = () => {
  avatarPreview.src = '/img/muffin-grey.svg';
};

///////// Превью фотографий объекта в объявлении
// Тут мы отступаем от ТЗ, в котором не говорится о загрузке нескольких фото,
// но загружаемые объявления бывают с несколькими фото, и внешний вид блока-контейнера подсказывает,
// что туда поместится до 10 миниатюр без искжения раметки
photosFileChooser.setAttribute('multiple', 'multiple');
photosFileChooser.setAttribute('accept', 'image/png, image/jpeg');
photosPreviewElement.style.overflow = 'hidden';

// Отдельной функцией генерируем блок с изображением
const createPhotoPreview = (url, number) => {
  const newPhoto = photosPreviewElement.cloneNode(true);
  newPhoto.append(document.createElement('img'));
  newPhoto.firstChild.setAttribute('src', url);
  newPhoto.firstChild.setAttribute('alt', `Фотография-${number}`);
  newPhoto.firstChild.style.width = PHOTO_PREVIEWS.STYLE.width;
  newPhoto.firstChild.style.height = PHOTO_PREVIEWS.STYLE.height;
  return newPhoto;
};

const resetPhotosPreview = () => {
  photosPreviewContainer.querySelectorAll('.ad-form__photo').forEach((it) => it.remove());
  photosPreviewContainer.append(photosPreviewElement);
};

// При выборе изображений в цикле создаем элементы из массива файлов соответствующего поля photosFileChooser
photosFileChooser.addEventListener('change', () => {
  resetPhotosPreview();
  photosPreviewElement.remove(); // Пустой элемент в контейнере не нужен
  for (let i = 0; i < photosFileChooser.files.length; i++) {
    if (FILE_TYPES.some((it) => photosFileChooser.files[i].name.toLowerCase().endsWith(it))) {
      photosPreviewContainer.append(createPhotoPreview(URL.createObjectURL(photosFileChooser.files[i]), i + 1));
      if (i === PHOTO_PREVIEWS.COUNT - 1) { break; } // не даем блоку фотографий переполниться, потму и не используем forEach
    }
  }
});


//// Валидация формы ////
// Добавляем необходимые атрибуты
titleField.setAttribute('data-pristine-required-message', 'Обязательно впишите заголовок');
priceField.setAttribute('data-pristine-required-message', 'Укажите цену');
addressField.setAttribute('readonly', true);

//  Добавляем NoUISlider
noUiSlider.create(priceSlider, {
  range: {
    min: MIN_PRICES[typeField.value],
    max: MAX_PRICE,
  },
  start: MIN_PRICES[typeField.value],
  step: 1,
  connect: 'lower',
});

priceSlider.noUiSlider.on('update', () => {
  priceField.value = Number(priceSlider.noUiSlider.get()).toFixed(0);
});

// Создаем экземпляр Pristine и назначем проверку по событию отправки формы
const pristine = new Pristine(form,
  {
    classTo: 'ad-form__element',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'p',
    errorTextClass: 'ad-form__invalid-message'
  },
  true);


// Тип и количество комнат по смыслу зависят от объекта недвижимости и в реальной жизни не могут произвольно меняться
// логичнее верифицировать зависимые от них поля, поэтому при изменении их состояния просто запускем валидацию
roomsField.addEventListener('change', () => pristine.validate());
typeField.addEventListener('change', () => {
  priceSlider.noUiSlider.updateOptions({
    range: {
      min: MIN_PRICES[typeField.value],
      max: MAX_PRICE,
    },
  });
  pristine.validate();
});

timeinField.addEventListener('change', () => { timeoutField.value = timeinField.value; });
priceField.addEventListener('change', () => { priceSlider.noUiSlider.set(Number(priceField.value)); });
timeoutField.addEventListener('change', () => { timeinField.value = timeoutField.value; });


// Фукции для проверки каждого отдельного поля
const validateTitle = (value) => value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH;
const validatePrice = (value) => value >= MIN_PRICES[typeField.value] && value <= MAX_PRICE;
const validateCapacity = () => (Number(roomsField.value) === 100 && Number(capacityField.value) === 0) ||
  (Number(roomsField.value) !== 100 && Number(roomsField.value) >= Number(capacityField.value));


// Генерация сообщений для невалидных полей
const getTitleValidationError = () => {
  if (titleField.value === '') {
    return 'Обязательно укажите заголовок!';
  } else if (titleField.value.length < MIN_TITLE_LENGTH) {
    return `Минимальная длина заголовка - ${MIN_TITLE_LENGTH} симв.`;
  } else if (titleField.value.length > MAX_TITLE_LENGTH) {
    return `Максимальная длина заголовка - ${MAX_TITLE_LENGTH} симв.`;
  }
};

const getPriceValidationError = () => {
  if (priceField.value < MIN_PRICES[form.querySelector('#type').value]) {
    return `Цена не может быть меньше ${MIN_PRICES[form.querySelector('#type').value]} руб.`;
  } else if (priceField.value > MAX_PRICE) {
    return `Цена не может быть больше ${MAX_PRICE} руб.`;
  }
};

const getCapacityValidationError = () => {
  if (Number(roomsField.value) === 100 && Number(capacityField.value) > 0) {
    return 'Столько комнат не для гостей';
  } else if (Number(capacityField.value) >= 0 && Number(capacityField.value) > Number(roomsField.value)) {
    return 'Гостей не должно быть больше чем комнат';
  }
};

// Назначаем Pristine фунции валидации
pristine.addValidator(titleField, validateTitle, getTitleValidationError);
pristine.addValidator(priceField, validatePrice, getPriceValidationError);
pristine.addValidator(capacityField, validateCapacity, getCapacityValidationError);

// Функции внешнего интерфейса
const deactivateForm = () => {
  form.classList.add('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => { fieldset.disabled = true; });
};

const activateForm = () => {
  form.classList.remove('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => { fieldset.disabled = false; });
};

const setAddress = ({ lat, lng }) => {
  addressField.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

const onFormSubmit = (onSuccess, onFail) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      sendFormData(onSuccess, onFail, new FormData(evt.target));
      deactivateForm();
    }
  });
};

const onResetButtonClick = (handler) => {
  document.querySelector('.ad-form__reset').addEventListener('click', (evt) => {
    evt.preventDefault();
    handler();
  });
};

const resetForm = () => {
  form.reset();
  priceSlider.noUiSlider.updateOptions({
    range: {
      min: MIN_PRICES[typeField.value],
      max: MAX_PRICE,
    },
    start: MIN_PRICES[typeField.value],
  });
  resetAvatarChooser();
  resetPhotosPreview();
};

export { activateForm, deactivateForm, setAddress, onFormSubmit, onResetButtonClick, resetForm };
