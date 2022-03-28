const form = document.querySelector('.ad-form');

const deactivateForm = () => {
  form.classList.add('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => {fieldset.disabled = true;});
};

const activateForm = () => {
  form.classList.remove('ad-form--disabled');
  form.querySelectorAll('fieldset').forEach((fieldset) => {fieldset.disabled = false;});
};

export {activateForm, deactivateForm};
