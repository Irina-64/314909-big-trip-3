import {render, replace} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';

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
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type);

    const pointComponent = new PointView({
      point,
      destination,
      offers,
      onEditClick: () => {
        replacePointToForm();
      },
    });

    const editFormComponent = new EditFormView({
      point,
      destination,
      offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: () => {
        replaceFormToPoint();
      },
    });

    function replacePointToForm() {
      replace(editFormComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editFormComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
