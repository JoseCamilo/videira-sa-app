import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analytics = inject(Analytics);

  /**
   * Registra uma visualização de página
   * @param pageName Nome da página
   * @param pageTitle Título da página
   */
  logPageView(pageName: string, pageTitle: string): void {
    try {
      logEvent(this.analytics, 'page_view' as any, {
        page_title: pageTitle,
        page_path: pageName
      });
    } catch (e) {
      console.error('Erro ao registrar page_view:', e);
    }
  }

  /**
   * Registra um evento customizado
   * @param eventName Nome do evento
   * @param eventData Dados adicionais do evento
   */
  logCustomEvent(eventName: string, eventData?: Record<string, any>): void {
    try {
      logEvent(this.analytics, eventName as any, eventData || {});
    } catch (e) {
      console.error('Erro ao registrar evento:', e);
    }
  }

  /**
   * Registra compra/venda de ticket
   */
  logTicketPurchase(ticketValue: number, eventName?: string): void {
    try {
      logEvent(this.analytics, 'purchase' as any, {
        currency: 'BRL',
        value: ticketValue,
        items: [
          {
            item_id: 'ticket',
            item_name: eventName || 'Ingresso de Evento',
            price: ticketValue
          }
        ]
      });
    } catch (e) {
      console.error('Erro ao registrar compra:', e);
    }
  }

  /**
   * Registra erro na aplicação
   */
  logError(errorMessage: string, errorDetails?: any): void {
    try {
      logEvent(this.analytics, 'exception' as any, {
        description: errorMessage,
        fatal: false,
        details: JSON.stringify(errorDetails)
      });
    } catch (e) {
      console.error('Erro ao registrar exception:', e);
    }
  }

  /**
   * Registra login de usuário
   */
  logLogin(method: string = 'email'): void {
    try {
      logEvent(this.analytics, 'login' as any, {
        method: method
      });
    } catch (e) {
      console.error('Erro ao registrar login:', e);
    }
  }

  /**
   * Registra visualização de evento
   */
  logEventView(eventId: string, eventName: string): void {
    try {
      logEvent(this.analytics, 'view_item' as any, {
        items: [
          {
            item_id: eventId,
            item_name: eventName,
            item_category: 'evento'
          }
        ]
      });
    } catch (e) {
      console.error('Erro ao registrar view_item:', e);
    }
  }

  /**
   * Registra busca na aplicação
   */
  logSearch(searchQuery: string): void {
    try {
      logEvent(this.analytics, 'search' as any, {
        search_term: searchQuery
      });
    } catch (e) {
      console.error('Erro ao registrar search:', e);
    }
  }

  /**
   * Registra acesso ao dashboard
   */
  logDashboardAccess(dashboardName: string): void {
    try {
      logEvent(this.analytics, 'dashboard_access' as any, {
        dashboard_name: dashboardName,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Erro ao registrar dashboard_access:', e);
    }
  }
}
