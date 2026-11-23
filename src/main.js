import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointsModel,
  filterModel,
});
const filterPresenter = new FilterPresenter({
  filterContainer,
  pointsModel,
  filterModel,
});

filterPresenter.init();
tripPresenter.init();

newEventButton.addEventListener('click', () => tripPresenter.createPoint());
