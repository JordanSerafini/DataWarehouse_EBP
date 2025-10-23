import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator pour marquer une route comme publique (pas besoin d'auth)
 *
 * @example
 * @Public()
 * @Post('login')
 * async login() {
 *   // No authentication required
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
