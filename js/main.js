import { getAdsData } from './data.js';
import { onMapInit, showMarkers, resetMap } from './map.js';
import { showUploadErrorMessage, showDownloadErrorMessage, showSuccessUploadMessage, debounce } from './util.js';
import { onFormSubmit, onResetButtonClick, resetForm, activateForm, deactivateForm } from './form.js';
import { onFilterChange, activateFilter, deactivateFilter, resetFilterForm } from './filter.js';

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
      showSuccessUploadMessage();
      resetForm();
      resetFilterForm();
      resetMap();
      showMarkers(adsArray, ADS_COUNT);
      activateForm();
    }, () => {
      showUploadErrorMessage();
      activateForm();
    });

    onResetButtonClick(() => {
      resetForm();
      resetFilterForm();
      resetMap();
      showMarkers(adsArray, ADS_COUNT);
    });
  }, () => {
    showDownloadErrorMessage();
  });
});
