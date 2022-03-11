/* eslint-disable camelcase */
const BASE_URL = ' https://us-central1-involvement-api.cloudfunctions.net/capstoneApi';
const APP_ID = 'OAW88uh8tayXubZCqUNx';

export async function postLike(item_id) {
  return await fetch(`${BASE_URL}/apps/${APP_ID}/likes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id })
    }
  ).then(response => response.json());
}

export async function getLikesList() {
  return await fetch(`${BASE_URL}/apps/${APP_ID}/likes`).then(response => response.json());
}

export async function postComment(item_id, username, comment) {
  return await fetch(`${BASE_URL}/apps/${APP_ID}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id, username, comment })
    }
  ).then(response => response);
}

export async function getCommentList(item_id) {
  return await fetch(`${BASE_URL}/apps/${APP_ID}/comments?item_id=${item_id}`).then(response => response.json());
}