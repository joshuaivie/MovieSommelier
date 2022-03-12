const ModalTemplate = `
<section class="details-modal-container" id="details-modal">
    <div class="close-button" id="modal-close-button">
      <i class="fa-solid fa-close"></i>
    </div>
    <div class="details-popup">
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
          <div class="comments-container">
            <div class="add-comment-section">
              <div class="series-subtitle">Add Comment</div>
              <form class="add-comment-form" id="add-comment-form">
                <ul>
                  <li>
                    <input type="text" placeholder="Enter Your Name" name="commenter-name-input" id="commenter-name-input"
                      required>
                  </li>
                  <li>
                    <textarea rows="5" placeholder="Enter Your Comment" id="comment-input" name="comment-input"
                      required></textarea>
                  </li>
                  <li class="comment-form-buttons">
                    <button class="light-button" id="cancel-comment-button">Cancel</button>
                    <button type="submit" id="submit-comment-button">Comment</button>
                  </li>
                </ul>
              </form>
            </div>
            <div class="comments-list-section">
              <div class="series-subtitle"><span id="comment-count"></span> Comment(s)</div>
              <ul class="comments-list" id="modal-comments-list"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

export default ModalTemplate;