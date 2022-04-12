import { getAdsData } from './data.js';
import { showMarkers, resetMap } from './map.js';
import { createModalError, createModalSuccess } from './util.js';
import { onFormSubmit, onResetButtonClick, resetForm, activateForm } from './form.js';

const ADS_COUNT = 10;

getAdsData((adsArray) => showMarkers(adsArray.slice(0, ADS_COUNT)));

onFormSubmit(() => {
  createModalSuccess();
  resetForm();
  resetMap();
  activateForm();
}, () => {
  createModalError();
  activateForm();
});

onResetButtonClick(() => {
  resetForm();
  resetMap();
});
