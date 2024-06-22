import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ErrorCode } from '../enums';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(ctx: ExecutionContext) {
    const socket = ctx.switchToWs().getClient<Socket>();
    try {
      socket.handshake.auth = this.jwtService.verify(
        socket.handshake.headers.authorization.replace('Bearer ', ''),
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(ErrorCode.EXPIRED_TOKEN);
      }
      throw new UnauthorizedException(ErrorCode.INVALID_TOKEN);
    }
    return true;
  }
}
