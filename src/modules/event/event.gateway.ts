import { UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  GatewayMetadata,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { t } from 'i18next';
import { TokenExpiredError } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { NODE_ENV } from '~/common/constants';
import { ErrorCode, Locale, NodeEnv, WsEvent } from '~/common/enums';
import { WsExceptionFilter } from '~/common/filters';
import { Response, WsRequest, WsResponse } from '~/common/models';
import { UserRepository } from '~/repositories';
import { getLocale, initI18n } from '~/utils';
import { ROOM_ID } from './event.controller';

@WebSocketGateway<GatewayMetadata>({
  namespace: 'chat',
  transports: ['websocket', 'polling'],
  cors: { origin: true },
})
export class EventGateway {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  @WebSocketServer()
  private server: Server;

  // @UseGuards(WsGuard)
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage(WsEvent.AddUser)
  async addUser(socket: Socket, { token }: WsRequest) {
    try {
      const { id } = this.jwtService.verify(token);
      const { username } = await this.userRepository.findOne(
        { select: ['username'], where: { id } },
        true,
      );
      await socket.join(ROOM_ID /* `${id}` */);
      socket.send(`${username} has joined!`);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new WsException(ErrorCode.EXPIRED_TOKEN);
      }
      throw new WsException(ErrorCode.INVALID_TOKEN);
    }
  }

  emitError(roomId: string, error: Error, locale = Locale.En) {
    initI18n(getLocale(locale));
    this.server.to(roomId).emit(WsEvent.Error, {
      error:
        NODE_ENV === NodeEnv.Production
          ? {
              code: ErrorCode.INTERNAL_SERVER_ERROR,
              message: t(ErrorCode.INTERNAL_SERVER_ERROR),
              details: [],
            }
          : {
              code: error.message,
              message: t(error.message),
              details: [],
            },
    } as Response);
  }

  // @Interval(1000)
  emit(roomId: string, data: WsResponse) {
    // this.server
    //   .to(ROOM)
    //   .emit(WsEvent.NewMessage, { message: new Date().toLocaleString() });
    this.server.to(roomId).emit(WsEvent.NewMessage, data);
  }
}
