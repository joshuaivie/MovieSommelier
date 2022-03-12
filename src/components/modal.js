import moment from 'moment';
import { getDetails } from '../api/tvmaze-api';
import { getCommentList } from '../api/involvement-api';
import getFlagURL from './flagHelpers';

export default class DetailsModal {
  constructor(parentElement = document.body) {
    this.detailsModalElement = document.createElement('section');
    parentElement.appendChild(this.detailsModalElement);

    this.currentID = '';
    this.currentDetails = {};
    this.commentsList = [];
    this.visible = false;
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
      const detailsID = DetailsModal.#parseDetailsID(locationHash);

      if (locationHash.indexOf('details') && detailsID) {
        try {
          this.currentID = detailsID;

          const currentDetails = await getDetails(detailsID);
          const commentsList = await getCommentList(this.currentID);

          this.currentDetails = currentDetails;
          this.commentsList = Array.isArray(commentsList)
            ? DetailsModal.#formatComments(commentsList) : [];
          this.updateModalDetails();
          this.updateModalViewState();
        } catch (error) {
          this.errors.push(`${error.name} - ${error.message}`);
          alert(`An error occured trying to load details for ${this.currentDetails.name}`);
        }
      }
    };
  }

  static #formatComments(comments) {
    return comments.map((comment) => ({
      ...comment,
      creation_date: moment(comment.creation_date).format('LL'),
      creation_unix_time: moment(comment.creation_date).format('X'),
    })).sort((a, b) => a.creation_unix_time - b.creation_unix_time);
  }

  listenForCloseModal() {
    const closeButton = document.getElementById('modal-close-button');

    closeButton.onclick = (e) => {
      e.preventDefault();
      this.visible = false;
      this.updateModalViewState();
    };
  }

  static #parseDetailsID(locationHash = window.location.hash) {
    const detailsID = parseInt(locationHash.split('/').slice(-1).pop(), 10);
    return detailsID;
  }

  updateModalViewState() {
    const detailsModal = document.getElementById('details-modal');
    detailsModal.style.display = this.visible ? 'flex' : 'none';
  }

  updateModalDetails() {
    this.visible = false;
    this.updateModalDisplayImage();
    this.updateModalBackgroudImage();
    this.updateModalSeriesTitle();
    this.updateModalSeriesLanguage();
    this.updateModalSeriesRating();
    this.updateModalSeriesGenre();
    this.updateModalSeriesRuntime();
    this.updateModalSeriesDescription();
    this.updateModalCommentList();
    this.visible = true;
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
    seriesGenre.innerHTML = '';
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

  updateModalCommentList() {
    const commentsContainer = document.getElementById('modal-comments-list');
    commentsContainer.innerHTML = '';
    this.commentsList.forEach((item) => {
      commentsContainer.appendChild(DetailsModal.#createCommentElement(item));
    });
  }

  static #createCommentElement(commentObject) {
    const comment = document.createElement('li');
    comment.classList.add('comment');
    comment.innerHTML = `
      <div class="avatar">
        <img src="https://avatars.dicebear.com/api/pixel-art-neutral/${commentObject.username}.svg" alt="${commentObject.username}">
      </div>
      <div class="comment-content">
        <div class="comment-content-title">
          <div class="commenter-name">${commentObject.username}</div>
          <div class="comment-time">${commentObject.creation_date}</div>
        </div>
        <div class="comment-details">${commentObject.comment}</div>
      </div>`;
    return comment;
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
        <div class="comments-container">
          <div class="add-comment-section">
            <div class="series-subtitle">Add Comment</div>
            <form class="add-comment-form">
              <ul>
                <li>
                  <input type="text" placeholder="Enter Your Name" name="commenter-name-input" id="commenterNameInput"
                    required>
                </li>
                <li>
                  <textarea rows="5" type="number" id="commentInput" name="coment-input" required min="1"
                    placeholder="Enter Your Comment" required></textarea>
                </li>
                <li class="comment-form-buttons">
                  <button type="submit" class="light-button" id="submitScoreButton">Cancel</button>
                  <button type="submit" id="submitScoreButton">Comment</button>
                </li>
              </ul>
            </form>
          </div>
          <div class="comments-list-section">
            <div class="series-subtitle">Comment(s)</div>
            <ul class="comments-list" id="modal-comments-list"></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    `;
  }
}