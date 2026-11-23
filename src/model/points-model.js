import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #apiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      const points = await this.#apiService.getPoints();
      this.#points = points.map(PointsModel.adaptToClient);
    } catch {
      this.#points = [];
    }
  }

  async initDestinations() {
    try {
      this.#destinations = await this.#apiService.getDestinations();
    } catch {
      this.#destinations = [];
    }
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = [...points];
    this._notify(UpdateType.MAJOR);
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((offersByType) => offersByType.type === type)?.offers ?? [];
  }

  updatePoint(updateType, updatedPoint) {
    const pointIndex = this.#points.findIndex(({id}) => id === updatedPoint.id);

    if (pointIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    const pointIndex = this.#points.findIndex(({id}) => id === point.id);

    if (pointIndex === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      ...this.#points.slice(pointIndex + 1),
    ];

    this._notify(updateType, point);
  }

  static adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite,
    };

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      base_price: point.basePrice,
      date_from: point.dateFrom,
      date_to: point.dateTo,
      is_favorite: point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
