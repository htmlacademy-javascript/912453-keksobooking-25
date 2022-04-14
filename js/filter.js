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

const getFeaturesMatchRank = (advert) => {
  const checkedFeatures = featuresFilterField.querySelectorAll('input[type="checkbox"]:checked');
  let rank = 0;
  if (advert.offer.features && checkedFeatures.length > 0) {
    advert.offer.features.forEach((feature) => {
      if (Array.from(checkedFeatures).some((checkedFeature) => feature === checkedFeature.value)) {
        rank++;
      }
    });
  }
  return rank;
};

const applyFilter = (adsArray) => {
  const result = adsArray
    .filter(typeFilter)
    .filter(priceFilter)
    .filter(roomsFilter)
    .filter(guestsFilter)
    .map((advert) => {
      advert.rank = getFeaturesMatchRank(advert);
      return advert;
    });
  result.sort((a, b) => b.rank - a.rank);
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
