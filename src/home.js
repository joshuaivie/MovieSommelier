import { getList } from "./tvmaze-api";
import './images/like.svg'

export default class Home{
    pages;
    constructor(container = document.body, pageLength = 9){
        this.container = container;
        this.homeElement = document.createElement('section');
        this.homeElement.classList.add('home');
        this.series = [];
        this.pageLength = pageLength;
        this.page = 0;
    }

    get series(){
        return this._series;
    }
    set series(value){
        this.pages = [];
        for (var i = 0; i < value.length; i += this.pageLength)
          this.pages.push(value.slice(i, i + this.pageLength));
        this._series = value;
    }

     async init(){
        this.series = await getList();
        this.container.appendChild(this.homeElement);
        this.updateList();
    }


    updateList(){
        this.homeElement.innerHTML = `
        <ul class="movie-list">
            ${this.pages[this.page].map(series => `
            <li class="movie card">
                <img src="${series.image.medium}">
                <header>
                    <h2>${series.name}</h2>
                    <div class="likes">
                        <button class="like"><img src="./images/like.svg"></button>
                        <span>5 likes</span>
                    </div>
                </header>
                <a class="btn">Coments</a>
                <a class="btn">Reservations</a>
            </li>`).join('')}
        </ul>
        ${this.pages.length > 0?
            `<div class="paginator">
                <a href="#home" class="btn">1</a>
                <span>...</span>
                <a href="#home" class="btn">5</a>
                <a href="#home" class="btn">6</a>
                <a href="#home" class="btn">7</a>
                <a href="#home" class="btn">8</a>
                <a href="#home" class="btn">9</a>
                <span>...</span>
                <a href="#home" class="btn">99</a>
        </div>`:''}
        `
    }
}