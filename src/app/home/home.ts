import { Component, inject, OnInit } from '@angular/core';
import { Eventos } from '../eventos/eventos';
import { Instalacao } from '../instalacao/instalacao';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Eventos, Instalacao],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);
  nome = '';
  foto = '';

  ngOnInit() {
    this.authService.login$.subscribe(l => {
      this.nome = l.nome;
      this.foto = l.foto;
    });
    this.nome = this.authService.getNome();
    this.foto = this.authService.getFoto();
  }

  perfil() {
    this.router.navigate(['perfil']);
  }

}
