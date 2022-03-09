import { getList } from './tvmaze-api';
import './images/like.svg';
import { getLikesList } from './Involvement-api';

export default class Home {
  pages;

  seriesMap;

  _series;

  constructor(container = document.body, pageLength = 9) {
    this.container = container;
    this.homeElement = document.createElement('section');
    this.homeElement.classList.add('home');
    this.series = [];
    this.pageLength = pageLength;
    this.page = 0;
  }

  get series() {
    // eslint-disable-next-line no-underscore-dangle
    return this._series;
  }

  set series(value) {
    this.pages = [];
    this.seriesMap = {};
    value.map((series) => {
      series.likes = 0;
      this.seriesMap[series.id] = series;
      return series;
    });
    for (let i = 0; i < value.length; i += this.pageLength) {
      this.pages.push(value.slice(i, i + this.pageLength));
    }
    // eslint-disable-next-line no-underscore-dangle
    this._series = value;
  }

  async init() {
    try {
      this.series = await getList();
      (await getLikesList()).forEach((element) => {
        this.seriesMap[element.item_id].likes = element.likes;
      });
    } finally {
      this.container.appendChild(this.homeElement);
      this.updateList();
    }
  }

  updateList() {
    this.homeElement.innerHTML = `
        <ul class="movie-list"> 
            ${this.pages[this.page].map((series) => `
            <li class="movie card">
                <img src="${series.image.medium}">
                <header>
                    <h2>${series.name}</h2>
                    <div class="likes">
                        <button class="like"><img src="./images/like.svg"></button>
                        <span>${series.likes} likes</span>
                    </div>
                </header>
                <a class="btn">Coments</a>
                <a class="btn">Reservations</a>
            </li>`).join('')}
        </ul>
        ${this.pages.length > 0
    ? `<div class="paginator">
                <a href="#home" class="btn">1</a>
                <span>...</span>
                <a href="#home" class="btn">5</a>
                <a href="#home" class="btn">6</a>
                <a href="#home" class="btn">7</a>
                <a href="#home" class="btn">8</a> 
                <a href="#home" class="btn">9</a>
                <span>...</span>
                <a href="#home" class="btn">99</a>
        </div>` : ''}
        `;
  }
}