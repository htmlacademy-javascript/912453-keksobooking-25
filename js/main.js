import { getAdsData } from './data.js';
import { onMapInit, showMarkers, resetMap } from './map.js';
import { createModalError, createModalSuccess, debounce } from './util.js';
import { onFormSubmit, onResetButtonClick, resetForm, activateForm, deactivateForm } from './form.js';
import { onFilterChange, activateFilter, deactivateFilter, reserFilterForm } from './filter.js';

const ADS_COUNT = 10;

deactivateForm();
deactivateFilter();

onMapInit(() => {
  getAdsData((adsArray) => {
    showMarkers(adsArray, ADS_COUNT);
    onFilterChange(debounce(() => showMarkers(adsArray, ADS_COUNT)));
    activateForm();
    activateFilter();

    onFormSubmit(() => {
      createModalSuccess();
      resetForm();
      reserFilterForm();
      resetMap();
      showMarkers(adsArray, ADS_COUNT);
      activateForm();
    }, () => {
      createModalError();
    });

    onResetButtonClick(() => {
      resetForm();
      reserFilterForm();
      resetMap();
      showMarkers(adsArray, ADS_COUNT);
    });
  });
});
