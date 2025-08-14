import { registerAs } from "@nestjs/config";

export const databaseConfiguration = registerAs('database', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME || 'postgres',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOGGING === 'true',
}))
