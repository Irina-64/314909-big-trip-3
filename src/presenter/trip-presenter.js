import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreateFormView from '../view/create-form-view.js';
import PointView from '../view/point-view.js';

const POINT_COUNT = 3;

export default class TripPresenter {
  pointListComponent = new PointListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(this.pointListComponent, this.container);
    render(new EditFormView(), this.pointListComponent.getElement());
    render(new CreateFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
