import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HostessEvento } from './hostess-evento/hostess-evento';
import { Evento, EventoService } from '../eventos/evento.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-hostess',
  imports: [HostessEvento, Loading],
  templateUrl: './hostess.html',
  styleUrl: './hostess.scss',
})
export class Hostess implements OnInit, OnDestroy {

  router = inject(Router);

  eventoService = inject(EventoService);
  lastDocFilter: any;

  eventos: Evento[] = [];

  carregando = true;

  ngOnInit(): void {
    this.carregarMais()
  }

  ngOnDestroy(): void {
    this.eventos = [];
    this.lastDocFilter = null;
  }

  carregarMais() {
    this.eventoService.getEventosAtivos(20, this.lastDocFilter)
      .pipe(take(1))
      .subscribe({
        next: (novosEventos) => {
          this.eventos = [...this.eventos, ...novosEventos] as Evento[];
          if (novosEventos.length > 0) {
            this.lastDocFilter = novosEventos[novosEventos.length - 1];
          }
          this.carregando = false;
        },
        complete: () => this.carregando = false,
        error: () => this.carregando = false
      });
  }

  goBack() {
    this.router.navigate(['']);
  }
}
