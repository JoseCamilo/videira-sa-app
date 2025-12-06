import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { NotificationComponent } from './notification/notification';
import { Footer } from './footer/footer';
import { filter } from 'rxjs';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, NotificationComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  private analytics = inject(Analytics);

  constructor() {
    this.setupAnalyticsRouterTracking();
  }

  /**
   * Configura o rastreamento automático de rotas no Google Analytics
   */
  private setupAnalyticsRouterTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Scroll para o topo da página
      window.scrollTo({ top: 0 });

      // Registra a navegação no Google Analytics
      const pageTitle = this.getPageTitle(event.urlAfterRedirects);
      
      logEvent(this.analytics, 'page_view' as any, {
        page_path: event.urlAfterRedirects,
        page_title: pageTitle
      });
    });
  }

  /**
   * Mapeia a URL para um título legível para o Google Analytics
   * @param url URL da rota
   * @returns Título da página
   */
  private getPageTitle(url: string): string {
    const segments = url.split('/').filter(s => s);

    if (segments.length === 0) {
      return 'Home';
    }

    // Mapa de URLs para títulos legíveis
    const titleMap: Record<string, string> = {
      'dashboard-vendas': 'Dashboard de Vendas',
      'evento': 'Evento',
      'eventos': 'Eventos',
      'tickets': 'Meus Tickets',
      'checkout': 'Checkout',
      'perfil': 'Meu Perfil',
      'hostess': 'Hostess',
      'scanner': 'Scanner de Tickets',
      'termos-servico': 'Termos de Serviço',
      'politica-privacidade': 'Política de Privacidade',
      'exclusao-dados': 'Exclusão de Dados',
      'sobre-nos': 'Sobre Nós',
      'instalacao': 'Instalação',
      'auth': 'Autenticação',
      'pedidos-compra': 'Pedidos de Compra',
      'tickets-admin': 'Administração de Tickets'
    };

    const firstSegment = segments[0];
    return titleMap[firstSegment] || (firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1));
  }
}

