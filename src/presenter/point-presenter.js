import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #handleDataChange = null;

  #pointComponent = null;
  #editFormComponent = null;
  #point = null;
  #isEditMode = false;

  constructor({pointListContainer, pointsModel, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type);
    const previousPointComponent = this.#pointComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point,
      destination,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point,
      destination,
      offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    if (previousPointComponent === null || previousEditFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#isEditMode) {
      replace(this.#editFormComponent, previousEditFormComponent);
      return;
    }

    replace(this.#pointComponent, previousPointComponent);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#isEditMode = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#isEditMode = false;
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
