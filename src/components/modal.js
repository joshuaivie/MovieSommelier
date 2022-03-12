import moment from 'moment';
import getFlagURL from './flagHelpers';
import ModalTemplate from './modalTemplate';
import { getDetails } from '../api/tvmaze-api';
import { postComment, getCommentList } from '../api/involvement-api';

export default class DetailsModal {
  constructor(parentElement = document.body) {
    this.detailsModalElement = document.createElement('section');
    parentElement.appendChild(this.detailsModalElement);

    this.currentID = '';
    this.currentDetails = {};
    this.commentsList = [];
    this.visible = false;
    this.errors = [];
    this.changed = false;
  }

  init() {
    this.loadModalTemplate();
    this.listenForOpenModal();
    this.listenForAddComment();
    this.listForCancelComment();
    this.listenForCloseModal();
  }

  loadModalTemplate() {
    this.detailsModalElement.innerHTML = ModalTemplate;
  }

  listenForOpenModal() {
    window.onpopstate = async (e) => {
      e.preventDefault();

      const locationHash = window.location.hash;
      const detailsID = this.parseDetailsID(locationHash);

      if (locationHash.includes('details') && detailsID) {
        try {
          this.currentID = detailsID;

          const currentDetails = await getDetails(detailsID);
          const commentsList = await getCommentList(this.currentID);

          this.currentDetails = currentDetails;
          this.commentsList = Array.isArray(commentsList) ? this.formatComments(commentsList) : [];
          this.updateModalDetails();
          this.updateModalViewState();
        } catch (error) {
          this.errors.push(`${error.name} - ${error.message}`);
          alert(`An error occured trying to load details for ${this.currentDetails.name}`);
        }
      }
    };
  }

  listenForAddComment() {
    const commentInput = document.getElementById('comment-input');
    const commentForm = document.getElementById('add-comment-form');
    const commentsContainer = document.getElementById('modal-comments-list');
    const commenterNameInput = document.getElementById('commenter-name-input');

    commentForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = commenterNameInput.value;
      const comment = commentInput.value;
      this.clearCommentForm();
      try {
        if (username && comment) {
          await postComment(this.currentID, username, comment);
          const commentObject = this.createCommentObject(username, comment);
          const commentElement = this.createCommentElement(commentObject);
          commentsContainer.appendChild(commentElement);
          this.commentsList.push(commentObject);
          this.updateModalCommentsCount();
        } else {
          throw new Error('Input both username and comment');
        }
      } catch (error) {
        this.errors.push(`${error.name} - ${error.message}`);
        alert('An error occured trying post your comment');
      }
    };
  }

  listForCancelComment() {
    const cancelCommentButton = document.getElementById('cancel-comment-button');

    cancelCommentButton.onclick = (e) => {
      e.preventDefault();
      this.clearCommentForm();
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

  formatComments(comments) {
    this.changed = true;
    return comments.map((comment) => ({
      ...comment,
      creation_date: moment(comment.creation_date).format('LL'),
      creation_unix_time: moment(comment.creation_date).format('X'),
    })).sort((a, b) => b.creation_unix_time - a.creation_unix_time);
  }

  clearCommentForm() {
    this.changed = true;
    const commenterNameInput = document.getElementById('commenter-name-input');
    const commentInput = document.getElementById('comment-input');
    commenterNameInput.value = '';
    commentInput.value = '';
  }

  parseDetailsID(locationHash = window.location.hash) {
    this.changed = true;
    const detailsID = parseInt(locationHash.split('/').slice(-1).pop(), 10);
    return detailsID;
  }

  countComments(commentsList) {
    this.changed = true;
    if (Array.isArray(commentsList)) {
      return commentsList.length;
    }
    throw new Error('Expected comment list to be an array');
  }

  createCommentObject(username, comment) {
    this.changed = true;
    return {
      comment,
      username,
      creation_date: moment().format('LL'),
      creation_unix_time: moment().format('X'),
    };
  }

  updateModalViewState() {
    const detailsModal = document.getElementById('details-modal');
    detailsModal.style.display = this.visible ? 'block' : 'none';
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
    this.updateModalCommentsCount();
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
    this.changed = true;
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

  updateModalCommentsCount() {
    const commentsCount = document.getElementById('comment-count');
    commentsCount.innerHTML = this.countComments(this.commentsList);
  }

  updateModalCommentList() {
    const commentsContainer = document.getElementById('modal-comments-list');
    commentsContainer.innerHTML = '';
    this.commentsList.forEach((item) => {
      commentsContainer.appendChild(this.createCommentElement(item));
    });
  }

  createCommentElement(commentObject) {
    this.changed = true;
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
}