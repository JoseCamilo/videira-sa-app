import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Evento } from './evento/evento';
import { EventoService } from './evento.service';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { Observable, Subscription, take } from 'rxjs';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-eventos',
  imports: [Evento, FormsModule, Loading],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class Eventos implements OnInit, OnDestroy {

  eventoService = inject(EventoService);
  lastDocFilter: any;
  dateFilter: any;
  typeFilter: any;
  localFilter: any;

  date: string = '';
  type: string = 'Tipo de Evento';
  local: string = 'Localização';

  eventos: Evento[] = [];

  carregando = true;

  ngOnInit(): void {
    this.carregarMais()
  }

  ngOnDestroy(): void {
    this.eventos = [];
    this.lastDocFilter = null;
    this.dateFilter = null;
    this.typeFilter = null;
    this.localFilter = null;
  }

  carregarMais() {
    this.eventoService.getEventosAtivos(20, this.lastDocFilter, this.dateFilter, this.typeFilter, this.localFilter)
      .pipe(take(1))
      .subscribe({
        next: (novosEventos) => {
          this.eventos = [...this.eventos, ...novosEventos] as Evento[];
          if (novosEventos.length > 0) {
            this.lastDocFilter = novosEventos[novosEventos.length - 1];
          }
          this.carregando = false;
        },
        error: () => this.carregando = false
      });
  }

  onDateChange(event: any) {

    if (!event) {
      this.eventos = [];
      this.lastDocFilter = null;
      this.dateFilter = null;
      this.carregarMais();
      return
    }

    const inicio = new Date('2000-01-01T00:00:00');
    const fim = new Date('2050-12-31T00:00:00');
    const data = new Date(event + 'T00:00:00');

    if (data < fim && data > inicio) {
      this.eventos = [];
      this.lastDocFilter = null;
      this.dateFilter = event;
      this.carregarMais();
    }
  }

  onTypeChange(event: any) {

    if (!event || event == 'Tipo de Evento') {
      this.eventos = [];
      this.lastDocFilter = null;
      this.typeFilter = null;
      this.carregarMais();
      return
    }

    if (event != 'Tipo de Evento') {
      this.eventos = [];
      this.lastDocFilter = null;
      this.typeFilter = event;
      this.carregarMais();
    }
  }

  onLocalChange(event: any) {

    if (!event || event == 'Localização') {
      this.eventos = [];
      this.lastDocFilter = null;
      this.localFilter = null;
      this.carregarMais();
      return
    }

    if (event != 'Localização') {
      this.eventos = [];
      this.lastDocFilter = null;
      this.localFilter = event;
      this.carregarMais();
    }
  }

  limparFiltro() {
    this.eventos = [];
    this.lastDocFilter = null;
    this.dateFilter = null;
    this.typeFilter = null;
    this.localFilter = null;
    this.date = '';
    this.type = 'Tipo de Evento';
    this.local = 'Localização';
    this.carregarMais();
  }

}
