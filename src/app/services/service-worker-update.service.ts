import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

/**
 * Serviço responsável por gerenciar atualizações do Service Worker
 * Detecta quando novas versões estão disponíveis e notifica o usuário
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerUpdateService {
  private swUpdate = inject(SwUpdate);

  // Signal para indicar que uma atualização está disponível
  updateAvailable = signal(false);

  // Signal para armazenar informações sobre a atualização
  updateInfo = signal<{ version: string; timestamp: number } | null>(null);

  constructor() {
    this.initializeUpdateCheck();
  }

  /**
   * Inicializa o monitoramento de atualizações do Service Worker
   */
  private initializeUpdateCheck(): void {
    // Verifica se há suporte a Service Worker
    if (!this.swUpdate.isEnabled) {
      return;
    }

    // Detecta quando uma nova versão está pronta
    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
      )
      .subscribe(() => {
        this.handleNewVersionAvailable();
      });

    // Verifica periodicamente por atualizações (a cada 5 minutos)
    setInterval(() => {
      this.checkForUpdates();
    }, 5 * 60 * 1000);

    // Verifica por atualizações na inicialização
    this.checkForUpdates();

    // Verifica por atualizações quando a página recebe foco
    window.addEventListener('focus', () => {
      this.checkForUpdates();
    });
  }

  /**
   * Verifica manualmente por atualizações disponíveis
   */
  private checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.checkForUpdate()
      .then(() => {
        // Verificação concluída
      })
      .catch(error => {
        console.error('Erro ao verificar atualizações:', error);
      });
  }

  /**
   * Manipula quando uma nova versão está disponível
   */
  private handleNewVersionAvailable(): void {
    // Define que uma atualização está disponível
    this.updateAvailable.set(true);

    // Armazena informações sobre a atualização
    this.updateInfo.set({
      version: new Date().toISOString(),
      timestamp: Date.now()
    });

    // Log para debug
    console.log('Nova versão da aplicação disponível!');
  }

  /**
   * Força a atualização do Service Worker e recarrega a página
   * Deve ser chamado pelo usuário ou automaticamente após um tempo
   */
  public forceUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) {
      // Se SW não estiver habilitado, apenas recarrega a página
      window.location.reload();
      return Promise.resolve();
    }

    return this.swUpdate.activateUpdate()
      .then(() => {
        // Recarrega a página com o novo Service Worker ativado
        window.location.reload();
      })
      .catch(error => {
        console.error('Erro ao ativar atualização:', error);
        // Fallback: recarrega a página mesmo assim
        window.location.reload();
      });
  }

  /**
   * Recarrega a página sem Service Worker (força refresh completo)
   */
  public hardRefresh(): void {
    window.location.href = window.location.href;
  }

  /**
   * Obtém o status de disponibilidade de atualização (sinal)
   */
  public isUpdateAvailable(): boolean {
    return this.updateAvailable();
  }

  /**
   * Obtém as informações da atualização
   */
  public getUpdateInfo() {
    return this.updateInfo();
  }
}
