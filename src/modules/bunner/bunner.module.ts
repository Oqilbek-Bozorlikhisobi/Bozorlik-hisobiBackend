import { Module } from '@nestjs/common';
import { BunnerService } from './bunner.service';
import { BunnerController } from './bunner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bunner } from './entities/bunner.entity';
import { BunnerRepository } from './bunner.repository';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bunner]), FileModule],
  controllers: [BunnerController],
  providers: [
      { provide: 'IBunnerService', useClass: BunnerService },
      { provide: 'IBunnerRepository', useClass: BunnerRepository },
    ],
    exports: [
      { provide: 'IBunnerService', useClass: BunnerService },
      { provide: 'IBunnerRepository', useClass: BunnerRepository },
    ],
})
export class BunnerModule {}
