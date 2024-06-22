import { Request } from 'express';
import { createLogger, format } from 'winston';
import { File } from 'winston/lib/winston/transports';
import { WsRequest } from '~/common/models';

const logger = createLogger({
  format: format.printf(
    ({ message }) => `${new Date().toISOString()} — ${message}`,
  ),
  transports: new File({ filename: 'error.log', dirname: 'logs' }),
});

export const log = (error: Error, req?: Request | WsRequest) =>
  logger.log({
    level: 'error',
    message: JSON.stringify({
      error: JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      ),
      request: req && {
        body: req.body,
        headers: { authorization: req.headers.authorization },
        ip: req.ip,
        method: req.method,
        params: req.params,
        query: req.query,
        url: `${req.headers.origin}${req.originalUrl}`,
        user: req.user,
      },
    }),
  });
