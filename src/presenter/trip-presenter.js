import {render, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {generateSort} from '../mock/sort.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
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
  #emptyListComponent = null;

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
    const points = filter[this.#filterModel.filter](this.#pointsModel.points);

    if (points.length === 0) {
      this.#emptyListComponent = new EmptyListView({filterType: this.#filterModel.filter ?? FilterType.EVERYTHING});
      render(this.#emptyListComponent, this.#container);
      return;
    }

    this.#sortComponent = new SortView({
      sortItems: generateSort(),
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.#pointListComponent = new PointListView();

    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#container);
    this.#renderPoints(points);
  }

  #renderPoints(points) {
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
    remove(this.#emptyListComponent);
    this.#pointPresenters.clear();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handlePointsModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      this.#pointPresenters.get(data.id)?.init(data);
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
