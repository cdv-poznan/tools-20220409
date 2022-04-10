const apiUrl: string = 'https://jsonplaceholder.typicode.com';

const postsUrl: string = apiUrl + '/posts';
const commentsUrl: string = `${apiUrl}/comments`;
const usersUrl: string = `${apiUrl}/users`;

async function getApiResponse(url: string): Promise<any> {
  const postsRequest: Promise<Response> = fetch(url);
  const response: Response = await postsRequest;
  const json: any = await response.json();
  return json;
}

document.addEventListener('DOMContentLoaded', (): void => {
  const content = document.querySelector('#content');

  setTimeout((): void => {
    getApiResponse(postsUrl)
      .then(posts => {
        content.innerHTML = 'Select post&hellip;';

        for (const post of posts) {
          // addListElement(post);
        }
      })
      .finally((): void => {
        const loader = document.querySelector('#spinner');
        loader.remove();
      });
  }, 2000);
});

