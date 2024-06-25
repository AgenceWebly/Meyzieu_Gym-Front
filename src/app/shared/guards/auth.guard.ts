import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  let currentUser = storageService.getUser();

  if (route.data['userType'] === 'visitorOnly') {
    if (
      !storageService.isLoggedIn()
    ) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  if (route.data['userType'] === 'user') {
    if (
      storageService.isLoggedIn() &&
      currentUser.roles.includes('ROLE_USER')
    ) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  if (route.data['userType'] === 'guardian') {
    if (
      storageService.isLoggedIn() &&
      currentUser.roles.includes('ROLE_GUARDIAN')
    ) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  if (route.data['userType'] === 'trainer') {
    if (
      storageService.isLoggedIn() &&
      currentUser.roles.includes('ROLE_TRAINER')
    ) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  if (route.data['userType'] === 'admin') {
    if (
      storageService.isLoggedIn() &&
      currentUser.roles.includes('ROLE_ADMIN')
    ) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }
  
  return false;
};
