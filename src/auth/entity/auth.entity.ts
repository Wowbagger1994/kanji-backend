import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @Exclude()
  refreshToken: string;
}
