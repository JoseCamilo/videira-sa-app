
import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, OAuthProvider, linkWithCredential, fetchSignInMethodsForEmail, FacebookAuthProvider } from '@angular/fire/auth';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';
import { AnalyticsService } from '../services/analytics.service';

export interface User {
  id: string;
  nome: string;
  email: string;
  foto: string;
  adm: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: User = {
    id: '',
    nome: 'Desconectado',
    email: '',
    foto: '',
    adm: false
  };
  analyticsService = inject(AnalyticsService);

  constructor() {
    this.user.nome = this.getNome() || 'Desconectado';
    this.user.email = this.getEmail() || '';
    this.user.foto = this.getFoto() || '';

    this.loginSubject.next(this.user);
    this.validUserADM();
  }

  auth = inject(Auth);
  firestore = inject(Firestore)

  private loginSubject = new BehaviorSubject<User>(this.user);
  login$ = this.loginSubject.asObservable();

  private admSubject = new BehaviorSubject<boolean>(false);
  adm$ = this.admSubject.asObservable();

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;

        localStorage.setItem(btoa('nome'), btoa(user.displayName || ''));
        localStorage.setItem(btoa('email'), btoa(user.email || ''));
        localStorage.setItem(btoa('foto'), btoa(user.photoURL || ''));

        this.user.nome = user.displayName || '';
        this.user.email = user.email || '';
        this.user.foto = user.photoURL || '';

        this.loginSubject.next(this.user);
        this.validUserADM();
        this.analyticsService.logLogin('google');

      })
      .catch((error) => {
        console.error('Erro no login:', error);
      });
  }

  loginWithFacebook() {
    const provider = new OAuthProvider('facebook.com');
    provider.addScope('email');
    provider.addScope('public_profile');

    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;

        localStorage.setItem(btoa('nome'), btoa(user.displayName || ''));
        localStorage.setItem(btoa('email'), btoa(user.email || ''));
        localStorage.setItem(btoa('foto'), btoa(user.photoURL || ''));

        this.user.nome = user.displayName || '';
        this.user.email = user.email || '';
        this.user.foto = user.photoURL || '';

        this.loginSubject.next(this.user);
        this.validUserADM();
        this.analyticsService.logLogin('facebook');
      });
  }


  logout() {
    localStorage.setItem(btoa('nome'), '');
    localStorage.setItem(btoa('email'), '');
    localStorage.setItem(btoa('foto'), '');

    this.user = {
      id: '',
      nome: 'Desconectado',
      email: '',
      foto: '',
      adm: false
    };

    this.loginSubject.next(this.user);
    return signOut(this.auth);
  }

  getNome() {
    return atob(localStorage.getItem(btoa('nome')) || '');
  }
  getEmail() {
    return atob(localStorage.getItem(btoa('email')) || '');
  }
  getFoto() {
    return atob(localStorage.getItem(btoa('foto')) || '');
  }

  getUserByEmail(email: string): Observable<User | null> {
    const eventosRef = collection(this.firestore, 'users');
    const eventosQuery = query(eventosRef, where('email', '==', email));

    return (collectionData(eventosQuery, { idField: 'id' }) as Observable<User[]>).pipe(
      map(users => users.length > 0 ? users[0] : null),
      catchError(err => {
        console.error('Erro ao buscar eventos:', err);
        return of(null);
      })
    )
  }

  validUserADM(): Promise<boolean> {
    return new Promise(resolve => {
      const email = this.getEmail();
      if (email) {
        this.getUserByEmail(email)
          .pipe(take(1))
          .subscribe({
            next: (item) => {
              this.user.adm = item?.adm || false;
              this.admSubject.next(this.user.adm);
              this.loginSubject.next(this.user);
              resolve(this.user.adm);
            },
            complete: () => resolve(this.user.adm),
            error: () => resolve(false)
          });
      } else {
        resolve(false)
      }
    });
  }

}