// src/common/decorator/auth.decorator.ts
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ROLES_KEY } from '../consts/consts';
import { RolesGuard } from 'src/modules/shared/guards/role.guard';
import { RoleEnum } from '../enums/enum'  ;
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Auth(...role: RoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, role),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth('access-token'), // Swagger konfiguratsiyasidagi nom bilan bir xil
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiOkResponse({ description: 'OK' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}
