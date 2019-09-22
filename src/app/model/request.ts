export class Request {
  url: string;
  content: any;

  constructor(url: string, content?: any) {
    this.url = url;
    this.content = content;
  }
}
