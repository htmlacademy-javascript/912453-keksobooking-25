
// Функции создания модальных окон
const errorModalTemplate = document.querySelector('#error').content.querySelector('.error');
const successModatTemplate = document.querySelector('#success').content.querySelector('.success');

function onEscKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeModal();
  }
}

const createModalSuccess = () => {
  const newSuccessMessage = successModatTemplate.cloneNode(true);
  newSuccessMessage.classList.add('modal');
  showModal(newSuccessMessage);
};

const createModalError = () => {
  const newErrorMessage = errorModalTemplate.cloneNode(true);
  newErrorMessage.classList.add('modal');
  showModal(newErrorMessage);
};

function closeModal() {
  document.querySelector('.modal').remove();
  document.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', onEscKeydown);
}

function showModal(modalElement) {
  document.body.append(modalElement);
  document.addEventListener('click', closeModal);
  document.addEventListener('keydown', onEscKeydown);
}

export { createModalError, createModalSuccess };
