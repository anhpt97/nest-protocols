import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Index } from 'typeorm';
import { Idx, UserRole, UserStatus } from '~/common/enums';
import { ColumnVarchar, CreatedAt, PrimaryKeyColumn, UpdatedAt } from '~/utils';

@Entity('user')
export class User {
  @PrimaryKeyColumn()
  @ApiProperty()
  id: number;

  @ColumnVarchar()
  @Index(Idx.Username, { unique: true })
  @ApiProperty()
  username: string;

  @ColumnVarchar()
  @Index(Idx.Email, { unique: true })
  @ApiPropertyOptional()
  email: string;

  @ColumnVarchar({
    name: 'hashed_password',
    select: false,
  })
  hashedPassword: string;

  @ColumnVarchar()
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ColumnVarchar()
  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @CreatedAt()
  createdAt: Date;

  @UpdatedAt()
  updatedAt: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
