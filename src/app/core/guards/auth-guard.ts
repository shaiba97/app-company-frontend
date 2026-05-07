import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  // For session-based auth, we need to check if user is authenticated
  // This will be handled by the backend session cookie
  // For now, allow navigation and let backend handle auth
  return true;
  
  // TODO: Implement proper session-based auth check
  // if (authService.isLoggedIn()) {
  //   return true;
  // }
  // return router.createUrlTree(['/auth/login']);
};