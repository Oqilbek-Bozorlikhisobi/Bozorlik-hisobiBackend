import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminRepository } from './admin.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [
    { provide: 'IAdminService', useClass: AdminService },
    { provide: 'IAdminRepository', useClass: AdminRepository },
  ],
  exports: [
    { provide: 'IAdminService', useClass: AdminService },
    { provide: 'IAdminRepository', useClass: AdminRepository },
  ],
})
export class AdminModule {}
