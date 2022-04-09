const apiUrl = 'https://jsonplaceholder.typicode.com';

const postsUrl = apiUrl + '/posts';
const commentsUrl = `${apiUrl}/comments`;
const usersUrl = `${apiUrl}/users`;

async function getApiResponse(url) {
  const postsRequest = fetch(url);
  const response = await postsRequest;
  return await response.json();
}

async function setAuthor(authorId) {
  const userUrl = `${usersUrl}/${authorId}`;
  const user = await getApiResponse(userUrl);
  const userElement = document.getElementById('author');
  userElement.classList.add('author');
  userElement.innerHTML = `<h3>${user.name} <small>(${user.email})</small></h3>`;
}

async function loadComments(postId) {
  const postCommentsUrl = `${commentsUrl}?postId=${postId}`;
  const comments = await getApiResponse(postCommentsUrl);
  const commentsContainer = document.getElementById('comments');
  commentsContainer.innerHTML = '';
  for (const comment of comments) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
      <h4><i>${comment.name}</i> by <code>${comment.email}</code></h4>
      <p>${comment.body}</p>
    `;
    commentsContainer.append(commentElement);
  }
}

async function addListElement(post) {
  const element = document.createElement('li');
  const label = `${post.id} ${post.title}`;
  element.innerText = label;
  element.classList.add('title');
  element.addEventListener('click', async () => {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
    setAuthor(post.userId);
    loadComments(post.id);
  });
  const listContainer = document.getElementById('list');
  listContainer.append(element);
}

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('#content');

  setTimeout(() => {
    getApiResponse(postsUrl)
      .then(posts => {
        content.innerHTML = 'Select post&hellip;';

        for (const post of posts) {
          addListElement(post);
        }
      })
      .finally(() => {
        const loader = document.querySelector('#spinner');
        loader.remove();
      });
  }, 2000);
});
