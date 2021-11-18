import { NOT_FOUND } from './constants';

export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.name = NOT_FOUND;
    this.message = message;
  }
}
