import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointsModel,
});
const filterPresenter = new FilterPresenter({
  filterContainer,
  pointsModel,
  filterModel,
});

filterPresenter.init();
tripPresenter.init();
