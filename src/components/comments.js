import { getDetails } from "../api/tvmaze-api";

export default class CommentViewer {
  commentViewerTemplate = '';

  constructor(parentElement = document.body) {
    this.commentViewerElement = document.createElement('section');
    parentElement.appendChild(this.commentViewerElement)

    this.currentID = ''
    this.currentDetails = {}
    this.visible = false
    this.errors = []
  }

  init() {
    this.loadCommentViewer()
    this.listenForPopState()
  }

  loadCommentViewer() {
    this.commentViewerElement.innerHTML = ``
  }

  async loadDetails(ID) {
    try {
      this.currentDetails = await getDetails(ID);
      return true
    } catch (error) {
      this.errors.push(error.message)
      return false
    }
  }

  parseDetailsID(locationHash = window.location.hash) {
    const detailsID = parseInt(locationHash.split('/').slice(-1).pop(), 10)
    if (detailsID) {
      return detailsID
    }
  }

  listenForPopState() {
    window.onpopstate = async (event) => {
      const locationHash = window.location.hash
      const detailsID = this.parseDetailsID(locationHash)

      if (locationHash.indexOf('details') && detailsID) {
        this.currentID = detailsID;
        this.currentDetails = await this.loadDetails(detailsID)
        this.visible = true
        this.showDetails
      }
    }
  }

}