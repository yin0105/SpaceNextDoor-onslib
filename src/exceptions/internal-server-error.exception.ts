import { INTERNAL_SERVER_ERROR } from './constants';

export class InternalServerError extends Error {
  constructor(message: string) {
    super();
    this.name = INTERNAL_SERVER_ERROR;
    this.message = message;
  }
}
