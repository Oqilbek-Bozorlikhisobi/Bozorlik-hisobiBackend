import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { SelfGuard } from '../shared/guards/self.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('IAdminService') private readonly adminService: AdminService,
  ) {}

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

  @Auth(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Auth(RoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Auth(RoleEnum.ADMIN)
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.delete(id);
  }
}
