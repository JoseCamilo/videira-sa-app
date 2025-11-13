import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket, TicketService } from './tickets.service';
import { take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Loading } from '../loading/loading';
import { TicketEvento } from './ticket-evento/ticket-evento';

@Component({
  selector: 'app-tickets',
  imports: [Loading, TicketEvento],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets implements OnInit, OnDestroy {

  authService = inject(AuthService)
  router = inject(Router);
  ticketService = inject(TicketService);
  lastDocFilter: any;
  tickets: Ticket[] = [];
  carregando = true;
  user = '';

  ngOnInit(): void {
    this.user = this.authService.getEmail();
    this.carregarMais();
  }

  ngOnDestroy(): void {
    this.tickets = [];
    this.lastDocFilter = null;
  }

  carregarMais() {
    this.ticketService.getMeusTicketsAtivos(this.user, 20, this.lastDocFilter)
      .pipe(take(1))
      .subscribe({
        next: (novos) => {
          this.tickets = [...this.tickets, ...novos] as Ticket[];
          if (novos.length > 0) {
            this.lastDocFilter = novos[novos.length - 1];
          }
          this.carregando = false;
        },
        error: () => this.carregando = false
      });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
