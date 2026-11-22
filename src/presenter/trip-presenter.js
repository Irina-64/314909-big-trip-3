import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {generateSort} from '../mock/sort.js';
import {FilterType, SortType} from '../const.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();
  #pointPresenters = new Map();

  #points = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    if (this.#points.length === 0) {
      render(new EmptyListView({filterType: FilterType.EVERYTHING}), this.#container);
      return;
    }

    render(new SortView({
      sortItems: generateSort(),
      currentSortType: SortType.DAY,
    }), this.#container);
    render(this.#pointListComponent, this.#container);

    for (const point of this.#points) {
      this.#renderPoint(point);
    }
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
    this.#points = this.#points.map((point) => (
      point.id === updatedPoint.id ? updatedPoint : point
    ));
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };
}
