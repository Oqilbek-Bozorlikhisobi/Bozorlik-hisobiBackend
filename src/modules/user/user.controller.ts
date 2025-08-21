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
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QuerySearchDto } from './dto/query-search.dto';
import { ChangePhoneNumberDto } from '../auth/dto/change-phone-number.dto';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { SendOtpAgainDto } from '../auth/dto/send-otp-again.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { Auth } from '../../common/decorator/auth.decorator';
import { RoleEnum } from '../../common/enums/enum';
import { SelfGuard } from '../shared/guards/self.guard';
import { Request } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: UserService,
  ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER)
  @Post('change/phone-number/:id')
  changePhoneNumber(
    @Param('id') id: string,
    @Body() changePhoneNumberDto: ChangePhoneNumberDto,
  ) {
    return this.userService.changePhoneNumber(id, changePhoneNumberDto);
  }

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER)
  @Post('send-otp-again/phone-number/:id')
  sendOtpAgainForChangePhoneNumber(
    @Param('id') id: string,
    @Body() sendOtpAgainDto: SendOtpAgainDto,
  ) {
    return this.userService.sendOtpAgainForChangePhoneNumber(
      id,
      sendOtpAgainDto,
    );
  }

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER)
  @Patch('verify/phone-number/:id')
  verifyOtpForChangePhoneNumber(
    @Param('id') id: string,
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    return this.userService.verifyOtpForChangePhoneNumber(id, verifyOtpDto);
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'region', required: false })
  findAll(@Query() query: QuerySearchDto) {
    return this.userService.findAll(query);
  }

  @Auth(RoleEnum.USER)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const payload:any = req?.user
    return this.userService.findOneById(payload?.id)
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseGuards(SelfGuard)
  @Auth(RoleEnum.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Auth(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
