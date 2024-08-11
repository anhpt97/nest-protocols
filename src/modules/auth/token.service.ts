import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '~/common/models';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
