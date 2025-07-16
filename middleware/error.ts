import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.log('\n[ INTERNAL ERROR ]\n\n', err);

    if (isHttpError(err)) {
        res.status(err.status ?? 500).json({ message: err.message });
    } else if (err instanceof Error) {
        res.status(500).json({ message: 'Error Occured' });
    } else {
        res.status(500).json({ message: 'Unknown internal issue' });
    }
};
