import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';

morgan.token('req-headers', (req: IncomingMessage): string | undefined =>
    JSON.stringify(req.headers, null, 2),
);
morgan.token(
    'res-headers',
    (req: IncomingMessage, res: ServerResponse): string | undefined =>
        JSON.stringify(res.getHeaders(), null, 2),
);

const devLogger = morgan(`

=== Request Info ===

:method :url :status

Request Headers: :req-headers

Response Headers: :res-headers
`);

export default devLogger;
