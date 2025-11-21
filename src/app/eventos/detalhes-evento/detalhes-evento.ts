import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '../evento/evento';
import { EventoService } from '../evento.service';
import { take } from 'rxjs';
import { Loading } from '../../loading/loading';

@Component({
  selector: 'app-detalhes-evento',
  imports: [Loading],
  templateUrl: './detalhes-evento.html',
  styleUrl: './detalhes-evento.scss',
})
export class DetalhesEvento implements OnInit, OnDestroy {

  router: Router = inject(Router);
  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id') || '';

  eventoService = inject(EventoService);

  evento: Evento | any;

  carregando = true;
  loaded = false;

  ngOnInit(): void {
    this.carregarEvento();
  }

  ngOnDestroy(): void {
    this.evento = null;
  }

  carregarEvento() {
    this.eventoService.getEventoById(this.id)
      .pipe(take(1))
      .subscribe({
        next: (item) => {
          this.evento = item;
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
