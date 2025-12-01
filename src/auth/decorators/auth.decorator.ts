import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesList } from 'src/users/static/roles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/guards.guard';

export function Auth(...roles: RolesList[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
