import * as express from 'express';
import { BadRequestError, NotFoundError } from '../core/ApiErrors';
import { sendToLogger } from '../rabbit';
import ResponseHandler from '../utils/responseHandler';

export class ServiceError extends Error {
    public code;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export const errorMiddleware = async (error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    await sendToLogger(error.name, error.message);
    if (error instanceof BadRequestError) {
        ResponseHandler.clientError(res, error.message);
    } else if (error instanceof NotFoundError) {
        ResponseHandler.notFound(res, error.message);
    } else {
        ResponseHandler.internal(res, error.message);
    }

    next();
};
