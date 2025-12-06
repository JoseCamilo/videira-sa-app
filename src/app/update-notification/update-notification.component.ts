import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceWorkerUpdateService } from '../services/service-worker-update.service';

/**
 * Componente que exibe uma notificação quando há atualização disponível
 * Oferece ao usuário a opção de atualizar a aplicação
 */
@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="updateService.updateAvailable()"
      class="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div class="bg-gradient-theme text-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <!-- Conteúdo principal -->
        <div class="p-4">
          <div class="flex items-start gap-3">
            <!-- Ícone -->
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a1 1 0 001 1h12a1 1 0 001-1V6a2 2 0 00-2-2H4zm12 12H4a2 2 0 01-2-2v-4a1 1 0 00-1-1H.5a1 1 0 001 1v4a4 4 0 004 4h12a1 1 0 001-1v-.5a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Texto -->
            <div class="flex-1">
              <h3 class="font-semibold text-sm">Atualização Disponível</h3>
              <p class="text-xs opacity-80 mt-1">Uma nova versão da aplicação está pronta. Clique para atualizar.</p>
            </div>

            <!-- Botão de fechar -->
            <button
              type="button"
              (click)="dismissNotification()"
              class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Barra de ações -->
        <div class="px-4 py-3 flex gap-2 justify-end backdrop-blur-sm" style="background-color: rgba(0, 0, 0, 0.15)">
          <button
            type="button"
            (click)="dismissNotification()"
            class="px-3 py-1 text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
          >
            Depois
          </button>
          <button
            type="button"
            (click)="updateNow()"
            class="px-3 py-1 text-xs font-semibold bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    @keyframes slideInFromBottom {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-in {
      animation: slideInFromBottom 0.3s ease-out;
    }
  `
})
export class UpdateNotificationComponent implements OnInit {
  updateService = inject(ServiceWorkerUpdateService);
  private dismissed = false;

  ngOnInit(): void {
    // Após 5 minutos sem interação, força a atualização
    setTimeout(() => {
      if (this.updateService.updateAvailable() && !this.dismissed) {
        this.updateNow();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Atualiza a aplicação agora
   */
  updateNow(): void {
    this.updateService.forceUpdate();
  }

  /**
   * Descarta a notificação
   */
  dismissNotification(): void {
    this.dismissed = true;
  }
}
