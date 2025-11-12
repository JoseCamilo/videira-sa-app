
import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';

export interface User {
  id: string;
  email: string;
  adm: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  auth = inject(Auth);
  firestore = inject(Firestore)

  private admSubject = new BehaviorSubject<boolean>(false);
  adm$ = this.admSubject.asObservable();
  atualizarUsuarioADM(is: boolean) {
    this.admSubject.next(is);
  }

  loginComGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;

        localStorage.setItem(btoa('nome'), btoa(user.displayName || ''));
        localStorage.setItem(btoa('email'), btoa(user.email || ''));
        localStorage.setItem(btoa('foto'), btoa(user.photoURL || ''));

        this.validUserADM();

      })
      .catch((error) => {
        console.error('Erro no login:', error);
      });
  }

  logout() {
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

  validUserADM():Promise<boolean> {
    return new Promise(resolve => {
      const email = this.getEmail();
      if (email) {
        this.getUserByEmail(email)
          .pipe(take(1))
          .subscribe({
            next: (item) => {
              this.atualizarUsuarioADM(item?.adm || false);
              resolve(item?.adm || false)
            },
            error: () => resolve(false)
          });
      } else {
        resolve(false)
      }
    });
  }

}