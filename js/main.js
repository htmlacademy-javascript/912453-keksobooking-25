import {createCards} from './cards.js';
import {deactivateForm} from './form.js';

deactivateForm();
const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(createCards(1));
