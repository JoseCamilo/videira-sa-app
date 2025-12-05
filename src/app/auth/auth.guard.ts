import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardADM implements CanActivate {
  
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.authService.validUserADM().then(result => {
        if (result) {
            resolve(true);
          } else {
            this.router.navigate(['']);
            resolve(false);
          }
      });      
    });
  }
}
@Injectable({ providedIn: 'root' })
export class AuthGuardUser implements CanActivate {
  
  authService = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      if (this.authService.getEmail()) {
            resolve(true);
          } else {
            this.notificationService.warning('Você precisa estar logado para acessar esta página.');
            this.router.navigate(['/perfil']);
            resolve(false);
          }     
    });
  }
}