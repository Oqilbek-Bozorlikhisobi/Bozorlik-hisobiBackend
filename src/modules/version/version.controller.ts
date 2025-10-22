import { Controller, Get, Query } from '@nestjs/common';
import { VersionService } from './version.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get('check')
  @ApiQuery({ name: 'package', required: true })
  @ApiQuery({ name: 'local', required: false })
  async checkUpdate(
    @Query('package') packageName: string,
    @Query('local') localVersion?: string,
  ) {
    if (!packageName) {
      return { error: 'package query param kerak' };
    }

    return await this.versionService.checkUpdate(packageName, localVersion);
  }
}
