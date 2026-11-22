import {getRandomPoint} from '../mock/points.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 4;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = [...points];
    this._notify();
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

  updatePoint(updatedPoint) {
    const pointIndex = this.#points.findIndex(({id}) => id === updatedPoint.id);

    if (pointIndex === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];

    this._notify(updatedPoint);
  }
}
