import { SetMetadata } from '@nestjs/common';
import { RolesList } from 'src/users/static/roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: RolesList[]) => {
  return SetMetadata(META_ROLES, args);
};
