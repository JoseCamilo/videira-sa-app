import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { PerfilDetalhesComponent } from './perfil-detalhes/perfil-detalhes';

@Component({
  selector: 'app-perfil',
  imports: [PerfilDetalhesComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  user: User | any = {
    nome: '',
    email: '',
    foto: ''
  };

  accountExistsWithDifferentCredential = false;
  loaded = false;

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  /**
   * Carrega os dados do usuário
   */
  private carregarDadosUsuario(): void {
    this.user.nome = this.authService.getNome();
    this.user.email = this.authService.getEmail();
    this.user.foto = this.authService.getFoto();

    this.authService.login$.subscribe(l => {
      this.user = l;
    });
  }

  goBack() {
    this.router.navigate(['']);
  }

  logout() {
    this.authService.logout();
  }

  loginWithGoogle() {
    this.accountExistsWithDifferentCredential = false;
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook()
      .catch(error => {
        console.error('Erro no login com Facebook:', error);

        if (error.code === 'auth/account-exists-with-different-credential') {
          this.accountExistsWithDifferentCredential = true;
        }
      });
  }
}

