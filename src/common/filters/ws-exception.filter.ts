import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpExceptionBody,
  InternalServerErrorException,
  WsExceptionFilter as _WsExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { t } from 'i18next';
import { Socket } from 'socket.io';
import { getLocale, initI18n, log } from '~/utils';
import { NODE_ENV } from '../constants';
import { ErrorCode, NodeEnv, WsEvent } from '../enums';
import { Response, WsRequest } from '../models';

@Catch()
export class WsExceptionFilter implements _WsExceptionFilter {
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
      socket.emit(WsEvent.Error, {
        error: {
          code: message,
          message: t(message),
          details: [],
        },
      } as Response);
      return;
    }

    log(exception, { body: req } as Request);

    socket.emit(
      WsEvent.Error,
      (NODE_ENV === NodeEnv.Production
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
              error: {
                code: ErrorCode.INTERNAL_SERVER_ERROR,
                ...exception,
                message: exception.toString(),
              },
            }) as Response,
    );
  }
}
