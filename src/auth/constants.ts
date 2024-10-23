import { env } from 'process';

export const jwtConstants = {
  secretAccessToken: env.JWT_ACCESS_TOKEN_SECRET,
  secretRefreshToken: env.JWT_REFRESH_TOKEN_SECRET,
};
