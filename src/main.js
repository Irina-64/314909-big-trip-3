import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import BigTripApiService from './api/big-trip-api-service.js';

const END_POINT = 'https://21.objects.pages.academy/big-trip';
const AUTHORIZATION = 'Basic c7v2n5k9m4q8x1z6';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const apiService = new BigTripApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel({apiService});
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

newEventButton.addEventListener('click', () => tripPresenter.createPoint());

async function bootstrap() {
  await pointsModel.init();
  await pointsModel.initDestinations();

  filterPresenter.init();
  tripPresenter.init();
  newEventButton.disabled = false;
}

bootstrap();
