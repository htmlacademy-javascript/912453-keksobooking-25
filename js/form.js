const form = document.querySelector('.ad-form');

const deactivateForm = () => {
  form.classList.add('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => {fieldset.disabled = true;});
};

const activateForm = () => {
  form.classList.remove('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => {fieldset.disabled = false;});
};


//// Валидация формы ////

//Объявляем поля для валидации и константы
const titleField = form.querySelector('#title');
const roomsField = form.querySelector('#room_number');
const capacityField = form.querySelector('#capacity');
const priceField = form.querySelector('#price');
const typeField = form.querySelector('#type');

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


// Добавляем необходимые атрибуты для Pristine
titleField.setAttribute('data-pristine-required-message', 'Обязательно впишите заголовок');
priceField.setAttribute('data-pristine-required-message', 'Укажите цену');


// Создаем экземпляр Pristine и назначем проверку по событию отправки формы
const pristine = new Pristine(form,
  {
    classTo: 'ad-form__element',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'p',
    errorTextClass: 'ad-form__invalid-message'
  },
  true);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    form.submit();
  }
});

// Тип и количество комнат по смыслу зависят от объекта недвижимости и в реальной жизни не могут произвольно меняться
// логичнее верифицировать зависимые от них поля, поэтому при изменении их состояния просто запускем валидацию
roomsField.addEventListener('change', () => pristine.validate());
typeField.addEventListener('change', () => pristine.validate());


// Фукции для проверки каждого отдельного поля
const validateTitle = (value) => value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH;
const validatePrice = (value) => value >= MIN_PRICES[typeField.value] && value <= MAX_PRICE;
const validateCapacity = () => (Number(roomsField.value) === 100 && Number(capacityField.value) === 0) ||
  (Number(roomsField.value) !== 100 && Number(roomsField.value) >= Number(capacityField.value));


// Генерация сообщений для невалидных полей
const getTitleValidationError = () => {
  if (titleField.value === '') {
    return 'Обязательно укажите заголовок!';
  } else if(titleField.value.length < MIN_TITLE_LENGTH) {
    return `Минимальная длина заголовка - ${MIN_TITLE_LENGTH} симв.`;
  } else if(titleField.value.length > MAX_TITLE_LENGTH) {
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


export {activateForm, deactivateForm};
