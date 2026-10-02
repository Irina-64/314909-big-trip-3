import {render} from './render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter({container: tripEventsContainer});

render(new FilterView(), filterContainer);
tripPresenter.init();
