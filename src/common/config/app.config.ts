import { registerAs } from "@nestjs/config";

export const appConfiguration = registerAs('app', () => ({
    port: parseInt(process.env.APP_PORT || '3000', 10),
    host: process.env.APP_HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
    allowedOrigins: process.env.APP_ALLOWED_ORIGINS || 'http://localhost:3000',
}))
