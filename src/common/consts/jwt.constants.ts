// src/common/constants/jwt.constants.ts
export const jwtConstants = {
  secret: process.env.ACCESS_TOKEN_KEY || 'MyVeryVeryAccessTokenKey',
  expiresIn: process.env.ACCESS_TOKEN_TIME || '15h',
  refreshSecret: process.env.REFRESH_TOKEN_KEY || 'MyVeryVeryRefreshTokenKey',
  refreshExpiresIn: process.env.REFRESH_TOKEN_TIME || '15d',
};
