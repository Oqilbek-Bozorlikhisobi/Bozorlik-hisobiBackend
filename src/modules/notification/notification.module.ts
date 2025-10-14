import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { MarketModule } from '../market/market.module';
import { UserModule } from '../user/user.module';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  controllers: [NotificationController],
  providers: [
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'INotificationRepository', useClass: NotificationRepository },
  ],
  exports: [
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'INotificationRepository', useClass: NotificationRepository },
  ],
})
export class NotificationModule {}
