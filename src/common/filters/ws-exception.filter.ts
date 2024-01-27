import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpExceptionBody,
  InternalServerErrorException,
  WsExceptionFilter as _WsExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { t } from 'i18next';
import { Socket } from 'socket.io';
import { Logger, createLogger, format } from 'winston';
import { File } from 'winston/lib/winston/transports';
import { getLocale, initI18n } from '~/utils';
import { NODE_ENV } from '../constants';
import { ErrorCode, NodeEnv, WsEvent } from '../enums';
import { Response, WsRequest } from '../models';

@Catch()
export class WsExceptionFilter implements _WsExceptionFilter {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.printf(
        ({ message }) => `${new Date().toISOString()} — ${message}`,
      ),
      transports: new File({ filename: 'ws-error.log', dirname: 'logs' }),
    });
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const req = ctx.getData<WsRequest>();
    const socket = ctx.getClient<Socket>();

    initI18n(getLocale(req.locale));

    if (
      exception instanceof WsException ||
      (exception instanceof HttpException &&
        !(exception instanceof InternalServerErrorException))
    ) {
      const { message } = (
        exception instanceof HttpException ? exception.getResponse() : exception
      ) as HttpExceptionBody;
      socket.emit(WsEvent.ERROR, {
        error: {
          code: message,
          message: t(message),
          details: [],
        },
      } as Response);
      return;
    }

    this.log({ error: exception, request: req });

    socket.emit(
      WsEvent.ERROR,
      (NODE_ENV === NodeEnv.PRODUCTION
        ? {
            error: {
              code: ErrorCode.INTERNAL_SERVER_ERROR,
              message: t(ErrorCode.INTERNAL_SERVER_ERROR),
              details: [],
            },
          }
        : typeof exception.getResponse === 'function'
          ? { error: exception.getResponse() }
          : {
              error: { ...exception, message: exception.toString() },
            }) as Response,
    );
  }

  private log({ error, request }: { error: Error; request: WsRequest }) {
    this.logger.log({
      level: 'error',
      message: JSON.stringify({
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        request,
      }),
    });
  }
}
