import {render, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {generateSort} from '../mock/sort.js';
import {SortType} from '../const.js';
import {filter, sort} from '../utils.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #pointListComponent = null;
  #currentSortType = SortType.DAY;
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  #sortComponent = null;

  #pointPresenters = new Map();

  constructor({container, pointsModel, filterModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    this.#sortComponent = new SortView({
      sortItems: generateSort(),
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.#pointListComponent = new PointListView();

    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#container);
    this.#renderPoints();
  }

  #renderPoints() {
    const points = filter[this.#filterModel.filter](this.#pointsModel.points);
    const sortedPoints = sort[this.#currentSortType](points);

    for (const point of sortedPoints) {
      this.#renderPoint(point);
    }
  }

  #clearPointList() {
    this.#handleModeChange();
    this.#pointListComponent.element.replaceChildren();
    this.#pointPresenters.clear();
  }

  #clearTrip() {
    this.#handleModeChange();
    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    this.#pointPresenters.clear();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointsModelEvent = (updatedPoint) => {
    if (updatedPoint) {
      this.#pointPresenters.get(updatedPoint.id)?.init(updatedPoint);
      return;
    }

    this.#clearTrip();
    this.#renderTrip();
  };

  #handleFilterModelEvent = () => {
    this.#currentSortType = SortType.DAY;
    this.#clearTrip();
    this.#renderTrip();
  };
}
