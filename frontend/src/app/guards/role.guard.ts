import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    if (!authService.hasRole(allowedRoles[0]) && !allowedRoles.includes(authService.getUserRole() ?? '')) {
      router.navigate(['/home']);
      return false;
    }

    return true;
  };
};