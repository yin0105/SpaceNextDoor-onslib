import { INVALID_PAYLOAD_ERROR } from './constants';

export class InvalidPayloadError extends Error {
  constructor(message: string) {
    super();
    this.name = INVALID_PAYLOAD_ERROR;
    this.message = message;
  }
}
