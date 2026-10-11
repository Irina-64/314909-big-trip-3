import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();

  #points = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(this.#pointListComponent, this.#container);

    for (const point of this.#points) {
      render(new PointView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersByType(point.type),
      }), this.#pointListComponent.element);
    }
  }
}
