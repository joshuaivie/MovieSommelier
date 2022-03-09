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
    this.navigate(window.location.hash);
    window.addEventListener('popstate', () => this.navigate(window.location.hash));
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

  navigate(hash) {
    if(hash === '') hash = '#home/1';
    if (hash.startsWith('#home/')) {
      const page = Number.parseInt(hash.split('/')[1], 10)-1;
      if (this.page !== page) {
        this.page = page;
        if (page < this.pages.length) this.updateList();
      }
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
        ${this.paginator()}
        `;
  }

  paginator() {
    return this.pages.length > 0 ? `<div class="paginator">
      ${this.page > 4 ? `<a href="#home/1" class="btn">1</a>
      <span>...</span>` : ''}
      ${[...Array(Math.min(this.pages.length, Math.max(this.page + 3, 5))).keys()] // eslint-disable-next-line indent, max-len
      .slice(Math.max(Math.min(this.pages.length - 5, this.page - 3), 0)) // eslint-disable-next-line indent
      .map((page) => `<a href="#home/${page+1}" class="btn">${page + 1}</a>`).join('')}
      ${this.pages.length - this.page > 5 ? `<span>...</span>
      <a href="#home/${this.pages.length}" class="btn">${this.pages.length}</a>` : ''}
    </div>` : '';
  }
}