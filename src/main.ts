interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Author {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface DataProvider {
  getPosts(): Promise<Post[]>;
  getComments(postId: number): Promise<Comment[]>;
  getAuthor(authorId: number): Promise<Author>;
}

class Api implements DataProvider {
  private static readonly postsSuffix: string = 'posts';
  private static readonly commentsSuffix: string = 'posts';
  private static readonly usersSuffix: string = 'posts';

  constructor(private readonly apiUrl: string) {}

  public async getPosts(): Promise<Post[]> {
    const url: string = this.getPostsUrl();
    const posts: Post[] = await this.getApiResponse(url);
    return posts;
  }

  public async getComments(postId: number): Promise<Comment[]> {
    const url: string = this.getCommentsUrl(postId);
    const comments: Comment[] = await this.getApiResponse(url);
    return comments;
  }

  public async getAuthor(authorId: number): Promise<Author> {
    const url: string = this.getAuthorUrl(authorId);
    const author: Author = await this.getApiResponse(url);
    return author;
  }

  private async getApiResponse<T>(url: string): Promise<T> {
    const postsRequest = fetch(url);
    const response = await postsRequest;
    return await response.json();
  }

  private getPostsUrl(): string {
    return `${this.apiUrl}/${Api.postsSuffix}`;
  }

  private getCommentsUrl(postId: number): string {
    return `${this.apiUrl}/${Api.commentsSuffix}?postId=${postId}`;
  }

  private getAuthorUrl(authorId: number): string {
    return `${this.apiUrl}/${Api.usersSuffix}/${authorId}`;
  }
}

const api: DataProvider = new Api('https://jsonplaceholder.typicode.com');

async function setAuthor(authorId: number): Promise<void> {
  const user = await api.getAuthor(authorId);
  const userElement = document.getElementById('author');
  userElement.classList.add('author');
  userElement.innerHTML = `<h3>${user.name} <small>(${user.email})</small></h3>`;
}

async function loadComments(postId: number): Promise<void> {
  const comments = await api.getComments(postId);
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

async function addListElement(post: Post): Promise<void> {
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

document.addEventListener('DOMContentLoaded', (): void => {
  const content = document.querySelector('#content');

  setTimeout(async (): Promise<void> => {
    const posts: Post[] = await api.getPosts();
    content.innerHTML = 'Select post&hellip;';

    for (const post of posts) {
      addListElement(post);
    }
    const loader = document.querySelector('#spinner');
    loader.remove();
  }, 2000);
});
