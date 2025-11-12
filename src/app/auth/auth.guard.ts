import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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