import { Request, Response } from 'express';
import { FunctionContext, FunctionEvent } from './context';
import { isObject, isArray } from '../helpers/utils';

export interface bodyJSON {
  email: string;
  otp: string;
}

export function createMiddleware(handler: any) {
  return async (req: Request, res: Response) => {
    const cb = (err: any, functionResult?: any): any => {
      if (err) {
        console.error(err);

        return res.status(500).send(err.toString ? err.toString() : err);
      }

      if (isArray(functionResult) || isObject(functionResult)) {
        res
          .set(fnContext.headers())
          .status(<number>fnContext.status())
          .json(functionResult);
      } else {
        res
          .set(fnContext.headers())
          .status(<number>fnContext.status())
          .send(functionResult);
      }
    };

    const fnEvent = new FunctionEvent(req);
    const fnContext = new FunctionContext(cb);

    Promise.resolve(handler(fnEvent, fnContext, cb))
      .then(r => {
        if (!fnContext.cbCalled) {
          fnContext.succeed(r);
        }
      })
      .catch(e => {
        cb(e);
      });
  };
}
