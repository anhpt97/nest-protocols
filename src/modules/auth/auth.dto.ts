import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'superadmin' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;
}
