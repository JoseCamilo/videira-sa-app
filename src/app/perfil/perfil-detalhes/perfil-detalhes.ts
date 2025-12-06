import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { PerfilService, UserProfile } from '../perfil.service';
import { NotificationService } from '../../notification/notification.service';
import { Loading } from '../../loading/loading';

@Component({
  selector: 'app-perfil-detalhes',
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './perfil-detalhes.html',
  styleUrl: './perfil-detalhes.scss',
})
export class PerfilDetalhesComponent implements OnInit {
  authService = inject(AuthService);
  perfilService = inject(PerfilService);
  notificationService = inject(NotificationService);

  @Output() isReady = new EventEmitter<boolean>();

  perfil: UserProfile = {
    email: '',
    nome: '',
    foto: '',
    igreja: '',
    funcao: '',
    pastor: ''
  };

  // Estado interno do componente
  carregando = false;
  editando = false;
  salvando = false;
  perfilAnterior: UserProfile | null = null;

  // Subject para rastrear mudanças na igreja selecionada
  private igrejaSelecionadaSubject = new BehaviorSubject<string>('');

  // Observables para as listas de opções
  igrejas$ = this.perfilService.igrejas$;
  funcoes$ = this.perfilService.funcoes$;

  // Observable reativo que filtra pastores baseado na igreja selecionada
  pastores$: Observable<string[]> = this.igrejaSelecionadaSubject.pipe(
    switchMap(igreja => this.perfilService.filtrarPastoresPorIgreja(igreja))
  );

  ngOnInit() {
    this.perfilService.carregarOpcoes();
    this.carregarPerfil();

    // Monitora mudanças de login do usuário
    this.authService.login$.subscribe(() => {
      this.carregarPerfil();
    });
  }

  /**
   * Valida se todos os campos obrigatórios estão preenchidos
   */
  validarPerfil(): boolean {
    return !!(
      this.perfil.email &&
      this.perfil.nome &&
      this.perfil.igreja &&
      this.perfil.funcao &&
      this.perfil.pastor
    );
  }

  /**
   * Emite o status de validação
   */
  private emitirStatusValidacao(): void {
    const isValid = this.validarPerfil();
    this.isReady.emit(isValid);
  }

  /**
   * Carrega o perfil do usuário do Firestore
   */
  private carregarPerfil(): void {
    const userEmail = this.authService.getEmail();
    if (!userEmail) {
      return;
    }

    this.carregando = true;
    this.perfilService.getPerfilByEmail(userEmail).subscribe({
      next: (perfil) => {
        if (perfil) {
          this.perfil = perfil;
        } else {
          // Se não encontrar perfil, inicializa com dados do auth
          this.perfil = {
            email: userEmail,
            nome: this.authService.getNome(),
            foto: this.authService.getFoto()
          };
        }
        // Inicializa o subject com a igreja atual (se houver)
        if (this.perfil.igreja) {
          this.igrejaSelecionadaSubject.next(this.perfil.igreja);
        }
        this.carregando = false;
        this.emitirStatusValidacao();
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.carregando = false;
        this.emitirStatusValidacao();
      }
    });
  }

  /**
   * Atualiza a lista de pastores quando a igreja é alterada
   */
  atualizarPastoresPorIgreja(iglesiaSelecionada: string | undefined): void {
    this.igrejaSelecionadaSubject.next(iglesiaSelecionada || '');
    this.perfil.pastor = '';
    this.perfilService.carregarOpcoes(iglesiaSelecionada);
    this.emitirStatusValidacao();
  }

  /**
   * Inicia a edição dos dados
   */
  iniciarEdicao(): void {
    this.editando = true;
    // Salva uma cópia do perfil atual para possível rollback
    this.perfilAnterior = JSON.parse(JSON.stringify(this.perfil));
    this.perfilService.carregarOpcoes(this.perfil.igreja);
  }

  /**
   * Cancela a edição e restaura os dados anteriores
   */
  cancelarEdicao(): void {
    this.editando = false;
    if (this.perfilAnterior) {
      this.perfil = this.perfilAnterior;
      this.perfilAnterior = null;
    }
    this.emitirStatusValidacao();
  }

  /**
   * Salva os dados do perfil
   */
  async salvarPerfil(): Promise<void> {
    if (!this.perfil.email) {
      this.notificationService.error('Email do usuário não disponível.');
      return;
    }

    // Valida antes de salvar
    if (!this.validarPerfil()) {
      this.notificationService.error('Por favor, preencha todos os campos obrigatórios do perfil.');
      return;
    }

    this.salvando = true;

    try {
      await this.perfilService.saveOrUpdatePerfil(this.perfil);
      this.editando = false;
      this.perfilAnterior = null;
      this.salvando = false;
      this.emitirStatusValidacao();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      this.salvando = false;
    }
  }
}
