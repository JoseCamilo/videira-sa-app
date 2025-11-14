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
  foto = 'imagens/icon.png';

  ngOnInit() {
    this.nome = this.authService.getNome();
    this.foto = this.authService.getFoto();
  }

  perfil() {
    this.router.navigate(['perfil']);
  }

}
