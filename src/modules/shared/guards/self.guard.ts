import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // AuthGuard qo‘ygan payload
    const paramId = request.params.id;
    const queryUserId = request.query.userId;
    const search = request.query.search; // sening holatingda shu bo‘ladi

    if (!user) {
      throw new ForbiddenException('User mavjud emas');
    }

    // 1️⃣ Agar path param bo‘lsa
    if (paramId && user.id !== paramId) {
      throw new ForbiddenException('O‘z resursingizni ko‘ra olasiz xolos');
    }

    // 2️⃣ Agar query `userId` bo‘lsa
    if (queryUserId && user.id !== queryUserId) {
      throw new ForbiddenException('O‘z resursingizni ko‘ra olasiz xolos');
    }

    // 3️⃣ Agar query `search` bo‘lsa
    if (search && user.id !== search) {
      throw new ForbiddenException('O‘z resursingizni ko‘ra olasiz xolos');
    }

    return true;
  }
}
