import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  
  router: Router = inject(Router);
  authService = inject(AuthService);
  
  isShownMoremodal = false;
  itemActive = 1;

  isADM = false;

  nome = '';
  foto = 'imagens/icon.png';

  ngOnInit(): void {
    this.authService.adm$.subscribe(b => this.isADM = b);
    this.authService.validUserADM();
    this.nome = this.authService.getNome();
    this.foto = this.authService.getFoto();
  }
  
  openLink(link: string) {
    this.router.navigate([link]);
  }

  perfil() {
    this.router.navigate(['perfil']);
  }
}
 
