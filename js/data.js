const DOWNLOAD_URL = 'https://25.javascript.pages.academy/keksobooking/data';
const UPLOAD_URL = 'https://25.javascript.pages.academy/keksobooking';

const getAdsData = (onSuccess, onFail) => {
  fetch(DOWNLOAD_URL)
    .then((response) => response.ok ? response.json() : onFail())
    .then((data) => onSuccess(data))
    .catch(() => onFail());
};

const sendFormData = (onSuccess, onFail, body) => {
  fetch(UPLOAD_URL,
    {
      method: 'POST',
      body,
    })
    .then((response) => response.ok ? onSuccess() : onFail())
    .catch(() => onFail());
};

export { getAdsData, sendFormData };
