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
};

export { activateForm, deactivateForm, setAddress, onFormSubmit, onResetButtonClick, resetForm };
