import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { IUnitService } from './interfaces/unit.service';
import { ApiQuery } from '@nestjs/swagger';
import { QuerySearchDto } from './dto/query-search.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';

@Controller('unit')
export class UnitController {
  constructor(
    @Inject('IUnitService') private readonly unitService: IUnitService,
  ) {}

  @Auth(RoleEnum.ADMIN)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.unitService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOneById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.delete(id);
  }
}
