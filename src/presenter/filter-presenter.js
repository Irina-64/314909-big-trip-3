import {render, replace} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {generateFilter} from '../mock/filter.js';

export default class FilterPresenter {
  #filterContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({filterContainer, pointsModel, filterModel}) {
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: generateFilter(this.#pointsModel.points),
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (previousFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.filter = filterType;
  };

  #handleModelEvent = () => {
    this.init();
  };
}
