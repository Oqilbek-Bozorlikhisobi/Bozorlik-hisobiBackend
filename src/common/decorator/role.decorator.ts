import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../enums/enum";
import { ROLES_KEY } from "../consts/consts";

export const RoleDecorator = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
