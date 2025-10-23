import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator pour spécifier les rôles autorisés sur une route
 *
 * @example
 * @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
 * @Get('users')
 * async getUsers() {
 *   // Only super_admin and admin can access
 * }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
