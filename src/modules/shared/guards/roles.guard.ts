import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RoleEnum } from '../../../common/enums/enum';

export class RoleGuard implements CanActivate {
  constructor(private readonly roles: RoleEnum[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !this.roles.includes(user.role)) {
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    }

    return true;
  }
}
