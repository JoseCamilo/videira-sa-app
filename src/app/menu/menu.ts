import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  
  isShownMoremodal = false;
  itemActive = 1;

  isADM = false;

  nome = '';
  foto = '';

  ngOnInit(): void {
    this.authService.adm$.subscribe(b => this.isADM = b);
    this.authService.validUserADM();
    this.nome = this.authService.getNome();
    this.foto = this.authService.getFoto();
    
    // Detectar rota e destacar item do menu correspondente
    this.setActiveMenuItemByRoute();
    
    // Atualizar item ativo quando a rota mudar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveMenuItemByRoute();
      });
  }

  setActiveMenuItemByRoute() {
    const currentRoute = this.router.url;
    
    if (
      currentRoute.includes('/perfil') ||
      currentRoute.includes('/hostess') ||
      currentRoute.includes('/sobre-nos') ||
      currentRoute.includes('/politica-privacidade') ||
      currentRoute.includes('/termos-servico') ||
      currentRoute.includes('/exclusao-dados') ||
      currentRoute.includes('/contato') ||
      currentRoute.includes('/tickets-admin') ||
      currentRoute.includes('/scanner') ||
      currentRoute.includes('/pedidos-compra') ||
      currentRoute.includes('/dashboard-vendas')
    ) {
      this.itemActive = 3; // Mais
    } else if (currentRoute === '/' || currentRoute.includes('/evento')) {
      this.itemActive = 1; // Eventos
    } else if (currentRoute.includes('/tickets')) {
      this.itemActive = 2; // Meus Tickets
    } else {
      this.itemActive = 1; // Padrão para Eventos
    }
  }
  
  openLink(link: string) {
    this.router.navigate([link]);
  }

  perfil() {
    this.router.navigate(['perfil']);
  }
}
