import { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        if (status !== undefined) {
            this.status = status;
        }
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export class InputError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InputError.prototype);
    }
}

export class SqliteError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);
        if (code !== undefined) {
            this.code = code;
        }
        Object.setPrototypeOf(this, SqliteError.prototype);
    }
}

function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}

function isInputError(error: unknown): error is InputError {
    return error instanceof InputError;
}

function isSqliteError(error: unknown): error is SqliteError {
    return error instanceof SqliteError;
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.log('\n[ INTERNAL ERROR ]\n\n', err);

    if (isHttpError(err)) {
        res.status(err.status ?? 500).json({ message: err.message });
    } else if (isInputError(err)) {
        res.status(400).json({ message: err.message });
    } else if (isSqliteError(err)) {
        res.status(400).json({ message: err.message });
    } else if (err instanceof Error) {
        res.status(500).json({ message: 'Error Occured' });
    } else {
        res.status(500).json({ message: 'Unknown internal issue' });
    }
};
