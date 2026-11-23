import {getTotalPrice, getTripDates, getTripRoute, sortPointsByDate} from '../utils.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #tripTitleElement = null;
  #tripDatesElement = null;
  #tripCostElement = null;

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#tripTitleElement = this.#container.querySelector('.trip-info__title');
    this.#tripDatesElement = this.#container.querySelector('.trip-info__dates');
    this.#tripCostElement = this.#container.querySelector('.trip-info__cost-value');

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;

    this.#container.hidden = points.length === 0;
    if (points.length === 0) {
      return;
    }

    const destinations = sortPointsByDate(points)
      .map((point) => this.#pointsModel.getDestinationById(point.destination)?.name)
      .filter(Boolean);

    this.#tripTitleElement.textContent = getTripRoute(destinations);
    this.#tripDatesElement.textContent = getTripDates(points);
    this.#tripCostElement.textContent = getTotalPrice(points, this.#pointsModel.offers);
  }

  #handlePointsModelEvent = () => {
    this.#renderTripInfo();
  };
}
