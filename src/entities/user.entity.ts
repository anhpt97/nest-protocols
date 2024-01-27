import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Index } from 'typeorm';
import { Idx, UserRole, UserStatus } from '~/common/enums';
import { ColumnVarChar, CreatedAt, PrimaryKeyColumn, UpdatedAt } from '~/utils';

@Entity('user')
export class User {
  @PrimaryKeyColumn()
  @ApiProperty()
  id: number;

  @ColumnVarChar()
  @Index(Idx.USERNAME, { unique: true })
  @ApiProperty()
  username: string;

  @ColumnVarChar()
  @Index(Idx.EMAIL, { unique: true })
  @ApiPropertyOptional()
  email: string;

  @ColumnVarChar({
    name: 'hashed_password',
    select: false,
  })
  hashedPassword: string;

  @ColumnVarChar()
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ColumnVarChar()
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
