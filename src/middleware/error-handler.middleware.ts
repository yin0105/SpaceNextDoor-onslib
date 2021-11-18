import { FunctionContext } from './context';
import { NOT_FOUND, BAD_REQUEST } from '../exceptions';

export const ErrorHandler = (e: Error, context: FunctionContext) => {
  if (e.name === NOT_FOUND) {
    return (<FunctionContext>context.status(404)).succeed({
      message: e.message || e.name,
      code: NOT_FOUND,
    });
  } else if (e.name === BAD_REQUEST) {
    return (<FunctionContext>context.status(400)).succeed({
      message: e.message || e.name,
      code: BAD_REQUEST,
    });
  }

  return (<FunctionContext>context.status(500)).succeed({
    message: e.message,
    code: e.name,
  });
};
