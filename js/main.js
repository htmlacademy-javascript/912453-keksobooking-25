import {createCards} from './cards.js';
import {deactivateForm, activateForm} from './form.js';

deactivateForm();
activateForm(); // временно оставляю включенной для тестирования
const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(createCards(1));
