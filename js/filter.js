const filterForm = document.querySelector('.map__filters');
const typeFilterField = filterForm.querySelector('#housing-type');
const priсeFilterField = filterForm.querySelector('#housing-price');
const roomsFilterField = filterForm.querySelector('#housing-rooms');
const guestsFilterField = filterForm.querySelector('#housing-guests');
const featuresFilterField = filterForm.querySelector('#housing-features');

const typeFilter = (advert) => (typeFilterField.value === 'any') || (typeFilterField.value === advert.offer.type);
const priceFilter = (advert) => {
  const priceFilterValue = priсeFilterField.querySelector('option:checked').value;
  return (priсeFilterField.value === 'any') ||
    (priceFilterValue === 'low' && Number(advert.offer.price) < 10000) ||
    (priceFilterValue === 'high' && Number(advert.offer.price) > 50000) ||
    (priceFilterValue === 'middle' && Number(advert.offer.price) >= 10000 && Number(advert.offer.price) <= 50000);
};
const roomsFilter = (advert) => roomsFilterField.value === 'any' || Number(roomsFilterField.value) === advert.offer.rooms;
const guestsFilter = (advert) => guestsFilterField.value === 'any' || Number(guestsFilterField.value) === advert.offer.guests;
const featuresFilter = (advert) => {
  const checkedFeatures = featuresFilterField.querySelectorAll('input[type="checkbox"]:checked');
  advert.rank = 0;
  if (checkedFeatures.length === 0) {
    return true;
  } else if (advert.offer.features) {
    advert.offer.features.forEach((feature) => {
      if (Array.from(checkedFeatures).some((checkedFeature) => feature === checkedFeature.value)) {
        advert.rank++;
      }
    });
    // тут можно регулировать степень соответствия фильтру по "удобствам", но оставляю в соответствии с ТЗ жесткий фильтр,
    // а если в интерфейсе фильтра предусмотреть нестрогое соответствие, тут может быть условие вроде "> 0" или т.п.
    return advert.rank === checkedFeatures.length;
  } else {
    return false;
  }
};

const applyFilter = (adsArray) => {
  const result = adsArray
    .filter(typeFilter)
    .filter(priceFilter)
    .filter(roomsFilter)
    .filter(guestsFilter)
    .filter(featuresFilter); // т.к. нестрогое соответствие не предусмотрено, в данной версии удалил сортировку по rank
  return result;
};

const onFilterChange = (cb) => {
  filterForm.addEventListener('change', () => {
    cb();
  });
};

const deactivateFilter = () => {
  filterForm.querySelectorAll('.map__filter').forEach((field) => { field.disabled = true; });
};

const activateFilter = () => {
  filterForm.querySelectorAll('.map__filter').forEach((field) => { field.disabled = false; });
};

const resetFilterForm = () => {
  filterForm.reset();
};

export { onFilterChange, applyFilter, activateFilter, deactivateFilter, resetFilterForm };
