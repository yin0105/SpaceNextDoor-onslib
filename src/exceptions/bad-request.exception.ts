import { BAD_REQUEST } from './constants';

export class BadRequestError extends Error {
  constructor(message: string) {
    super();
    this.name = BAD_REQUEST;
    this.message = message;
  }
}
