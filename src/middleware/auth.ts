import { Request, Response, NextFunction } from 'express';

// Basic Authentication middleware.
// Credentials are passed base64 encoded and not encrypted
// This Middleware is for education purposes only
// AND NOT FOR PRODUCTION
export function basicAuth(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.set('WWW-Authenticate', 'Basic realm="Users API"');
        res.status(401).send('Authentication Required');
        return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
        base64Credentials,
        'base64',
    ).toString('utf8');

    const [username, password] = decodedCredentials.split(':');

    if (username === 'admin' && password === 'admin') {
        next();
        return;
    }

    res.set('WWW-Authenticate', 'Basic realm="Users API"');
    res.status(401).send('Invalid Credentials');
    return;
}
