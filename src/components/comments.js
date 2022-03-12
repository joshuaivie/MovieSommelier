import { getDetails } from '../api/tvmaze-api';
import getFlagURL from './flagHelpers';

export default class DetailsModal {
  constructor(parentElement = document.body) {
    this.detailsModalElement = document.createElement('section');
    parentElement.appendChild(this.detailsModalElement);

    this.currentID = '';
    this.currentDetails = {};
    this.updatedModalDetails = false;
    this.visible = true;
    this.errors = [];
  }

  init() {
    this.loadModalTemplate();
    this.listenForOpenModal();
    this.listenForCloseModal();
  }

  listenForOpenModal() {
    window.onpopstate = async (e) => {
      e.preventDefault();

      const locationHash = window.location.hash;
      const detailsID = DetailsModal.parseDetailsID(locationHash);

      if (locationHash.indexOf('details') && detailsID) {
        this.currentID = detailsID;
        this.currentDetails = await getDetails(detailsID);
        this.updateModalDetails();
        this.visible = this.updatedModalDetails;
        this.updateModalViewState();
      }
    };
  }

  listenForCloseModal() {
    const closeButton = document.getElementById('modal-close-button');

    closeButton.onclick = (e) => {
      e.preventDefault();
      this.visible = false;
      this.updateModalViewState();
    };
  }

  static parseDetailsID(locationHash = window.location.hash) {
    const detailsID = parseInt(locationHash.split('/').slice(-1).pop(), 10);
    return detailsID;
  }

  updateModalViewState() {
    const detailsModal = document.getElementById('details-modal');
    detailsModal.style.display = this.visible ? 'flex' : 'none';
  }

  updateModalDetails() {
    try {
      this.updatedModalDetails = false;
      this.updateModalDisplayImage();
      this.updateModalBackgroudImage();
      this.updateModalSeriesTitle();
      this.updateModalSeriesLanguage();
      this.updateModalSeriesRating();
      this.updateModalSeriesGenre();
      this.updateModalSeriesRuntime();
      this.updateModalSeriesDescription();
      this.updatedModalDetails = true;
    } catch (error) {
      this.errors.push(`${error.name} - ${error.message}`);
      alert(`An error occured trying to load details for ${this.currentDetails.name}`);
    }
  }

  updateModalDisplayImage() {
    const displayImage = document.getElementById('modal-display-image');
    displayImage.setAttribute('src', this.currentDetails.image.original);
  }

  updateModalBackgroudImage() {
    const backgroundImage = document.getElementById('modal-background-image');
    backgroundImage.style.backgroundImage = `url(${this.currentDetails.image.original})`;
  }

  updateModalSeriesTitle() {
    const seriesTitle = document.getElementById('modal-series-title');
    seriesTitle.innerHTML = this.currentDetails.name;
  }

  updateModalSeriesLanguage() {
    const seriesLanguage = document.getElementById('modal-series-langauage');
    seriesLanguage.setAttribute('src', getFlagURL(this.currentDetails.language));
    seriesLanguage.setAttribute('alt', this.currentDetails.language);
  }

  updateModalSeriesRating() {
    const seriesRating = document.getElementById('modal-series-rating');
    seriesRating.innerHTML = this.currentDetails.rating.average;
  }

  updateModalSeriesGenre() {
    const seriesGenre = document.getElementById('modal-series-genre');
    const mainGenre = document.createElement('li');
    mainGenre.innerHTML = `${this.currentDetails.genres[0]}`;
    seriesGenre.appendChild(mainGenre);
  }

  updateModalSeriesRuntime() {
    const seriesRuntime = document.getElementById('modal-series-runtime');
    seriesRuntime.innerHTML = `${this.currentDetails.runtime} mins`;
  }

  updateModalSeriesDescription() {
    const seriesDescription = document.getElementById('modal-series-description');
    const cleanedDescription = this.currentDetails.summary.replace('<b>', '').replace('</b>', '');
    seriesDescription.innerHTML = `${cleanedDescription}`;
  }

  loadModalTemplate() {
    this.detailsModalElement.innerHTML = `
    <section class="details-popup" id="details-modal">
    <div class="close-button" id="modal-close-button">
      <i class="fa-solid fa-close"></i>
    </div>
    <div class="image-container">
      <img src="#" class="image" id="modal-display-image">
      <div class="like-action">
        <div class="like-icon">
          <i class="fa-solid fa-heart"></i>
        </div>
        <div class="like-count">30</div>
      </div>
    </div>
    <div class="details-container">
      <div class="details-container-image" id="modal-background-image"></div>
      <div class="details-container-image-overlay"></div>
      <div class="details-container-backdrop"></div>
      <div class="details-container-content">
        <div class="details-section">
          <div class="series-title" id="modal-series-title"></div>
          <div class="series-highlights">
            <div class="series-lang-rating">
              <div class="series-language" id="series-language">
                <img src="#" width="20px" id="modal-series-langauage">
              </div>
              <div class="series-rating">
                <i class="fa-solid fa-star"></i>
                <div id="modal-series-rating"></div>
              </div>
              <ul class="series-genre" id="modal-series-genre"></ul>
            </div>
            <p id="modal-series-runtime"></p>
          </div>
          <div class="series-description" id="modal-series-description"></div>
        </div>
      </div>
    </div>
  </section>
    `;
  }
}