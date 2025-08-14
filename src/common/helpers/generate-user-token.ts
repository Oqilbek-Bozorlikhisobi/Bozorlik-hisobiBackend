import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types/tokens.type';
import { User } from '../../modules/user/entities/user.entity';

export async function generateUserTokens(
  user: User,
  jwtService: JwtService,
): Promise<Tokens> {
  const payload = {
    id: user.id,
    phoneNumber: user.phoneNumber,
  };

  const [access_token, refresh_token] = await Promise.all([
    jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_USER_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_USER_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);

  return { access_token, refresh_token };
}
