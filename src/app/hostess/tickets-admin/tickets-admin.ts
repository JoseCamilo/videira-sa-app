import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../loading/loading';
import { TicketsAdminService } from './tickets-admin.service';

export interface TicketListItem {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  email: string;
}

@Component({
  selector: 'app-tickets-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, Loading],
  templateUrl: './tickets-admin.html',
  styleUrl: './tickets-admin.scss'
})
export class TicketsAdminComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  ticketsAdminService = inject(TicketsAdminService);
  router = inject(Router);
  tickets: TicketListItem[] = [];
  allTickets: TicketListItem[] = [];
  searchEmail: string = '';
  carregando: boolean = true;
  eventoId: string | null = null;
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalTickets: number = 0;
  totalPaginas: number = 0;
  Math = Math;

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.queryParamMap.get('evento');
    this.carregarTodos(this.eventoId);
  }

  carregarTodos(eventoId: string | null): void {
    this.carregando = true;
    this.paginaAtual = 1;
    this.ticketsAdminService.getAllTicketsByEvent(eventoId || '').subscribe({
      next: (data) => {
        this.allTickets = data;
        this.totalTickets = data.length;
        this.calcularPaginacao();
        this.atualizarTicketsExibidos();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tickets:', err);
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  buscarPorEmail(): void {
    if (!this.searchEmail.trim()) {
      this.carregarTodos(this.eventoId);
      return;
    }

    this.carregando = true;
    this.paginaAtual = 1;
    this.ticketsAdminService.searchTicketsByEmail(this.searchEmail).subscribe({
      next: (data) => {
        this.allTickets = data;
        this.totalTickets = data.length;
        this.calcularPaginacao();
        this.atualizarTicketsExibidos();
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar tickets:', err);
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  limparFiltro(): void {
    this.searchEmail = '';
    this.carregarTodos(this.eventoId);
  }

  calcularPaginacao(): void {
    this.totalPaginas = Math.ceil(this.totalTickets / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas;
    }
  }

  atualizarTicketsExibidos(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.tickets = this.allTickets.slice(inicio, fim);
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.atualizarTicketsExibidos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual + 1);
  }

  obterPaginasDisponiveis(): number[] {
    const paginas: number[] = [];
    const maxBotoes = 5;
    const metade = Math.floor(maxBotoes / 2);
    let inicio = Math.max(1, this.paginaAtual - metade);
    let fim = Math.min(this.totalPaginas, this.paginaAtual + metade);

    if (fim - inicio + 1 < maxBotoes) {
      if (inicio === 1) {
        fim = Math.min(this.totalPaginas, inicio + maxBotoes - 1);
      } else {
        inicio = Math.max(1, fim - maxBotoes + 1);
      }
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  verDetalhes(ticketId: string): void {
    this.router.navigate(['/tickets-admin/detalhes'], { queryParams: { id: ticketId } });
  }

  voltar(): void {
    this.router.navigate(['/hostess']);
  }
}
