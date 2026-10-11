import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreateFormView from '../view/create-form-view.js';
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
    const [firstPoint] = this.#points;

    render(this.#pointListComponent, this.#container);
    render(new EditFormView({
      point: firstPoint,
      destination: this.#pointsModel.getDestinationById(firstPoint.destination),
      offers: this.#pointsModel.getOffersByType(firstPoint.type),
      destinations: this.#pointsModel.destinations,
    }), this.#pointListComponent.element);
    render(new CreateFormView(), this.#pointListComponent.element);

    for (const point of this.#points) {
      render(new PointView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersByType(point.type),
      }), this.#pointListComponent.element);
    }
  }
}
