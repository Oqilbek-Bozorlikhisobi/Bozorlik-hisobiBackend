import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types/tokens.type';
import { Admin } from '../../modules/admin/entities/admin.entity';
import { RoleEnum } from '../enums/enum';
import { User } from '../../modules/user/entities/user.entity';

export async function generateTokens(
  entity: Admin | User,
  jwtService: JwtService,
  role: RoleEnum
): Promise<Tokens> {
  const payload = {
    id: entity.id,
    username: role === RoleEnum.ADMIN ? (entity as Admin).createdAt : (entity as User).phoneNumber,
    role
  };

  const [access_token, refresh_token] = await Promise.all([
    jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);

  return { access_token, refresh_token };
}
