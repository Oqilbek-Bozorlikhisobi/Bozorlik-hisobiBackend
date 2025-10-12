import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfiguration } from './common/config/app.config';
import { databaseConfiguration } from './common/config/db.config';
import { debugDatabaseConfig } from './common/utils/database.debug';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { SmsModule } from './modules/sms/sms.module';
import { MarketModule } from './modules/market/market.module';
import { MarketListModule } from './modules/market_list/market_list.module';
import { BunnerModule } from './modules/bunner/bunner.module';
import { HistoryModule } from './modules/history/history.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { UnitModule } from './modules/unit/unit.module';
import { MarketTypeModule } from './modules/market_type/market_type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfiguration, databaseConfiguration],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'), //fayl saqlanadigon joy
      serveRoot: '/files', // Fayllar URL orqali faqat shu path orqali xizmat ko'rsatiladi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('DATABASE CONFIG >>>', configService.get('database'));
        const dbConfig = configService.get('database');
        const typeOrmConfig = {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          autoLoadEntities: dbConfig.autoLoadEntities,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
        };

        return debugDatabaseConfig(typeOrmConfig);
      },
    }),
    AdminModule,
    AuthModule,
    FileModule,
    CategoryModule,
    ProductsModule,
    UserModule,
    SmsModule,
    MarketModule,
    MarketListModule,
    BunnerModule,
    HistoryModule,
    FeedbackModule,
    UnitModule,
    MarketTypeModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule { }
