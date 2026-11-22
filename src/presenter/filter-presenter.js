import {render, replace} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {generateFilter} from '../mock/filter.js';
import {FilterType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: generateFilter(this.#pointsModel.points),
      currentFilterType: FilterType.EVERYTHING,
    });

    if (previousFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
  }
}
