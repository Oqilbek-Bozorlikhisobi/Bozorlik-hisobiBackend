import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { UnitRepository } from './unit.reposotory';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitController],
  providers: [
    { provide: 'IUnitService', useClass: UnitService },
    { provide: 'IUnitRepository', useClass: UnitRepository },
  ],
  exports: [
    { provide: 'IUnitService', useClass: UnitService },
    { provide: 'IUnitRepository', useClass: UnitRepository },
  ],
})
export class UnitModule {}
