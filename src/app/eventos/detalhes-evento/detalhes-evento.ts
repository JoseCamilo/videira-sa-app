import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventoService } from '../evento.service';
import { take } from 'rxjs';
import { Loading } from '../../loading/loading';
import { CurrencyFormatPipe } from "../../pipes/currency.pipe";

@Component({
  selector: 'app-detalhes-evento',
  imports: [Loading, CurrencyFormatPipe],
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
  verIngressos = false;

  ngOnInit(): void {
    this.carregarEvento();
  }

  ngOnDestroy(): void {
    this.evento = null;
  }

  get totalIngressos(): number {
    return this.evento.ingressos.reduce((acc: number, ingresso: any) => acc + ingresso.quantidade * ingresso.precoUnitario, 0);
  }

  carregarEvento() {
    this.eventoService.getEventoById(this.id)
      .pipe(take(1))
      .subscribe({
        next: (item) => {
          this.evento = item;
          this.evento.ingressos = this.evento.ingressos?.map((ingresso: any) => {
            ingresso['quantidade'] = 0;
            ingresso['id'] = this.id;
            return ingresso;
          });
          this.carregando = false;
        },
        complete: () => this.carregando = false,
        error: () => this.carregando = false
      });
  }

  async goBack() {
    this.router.navigate(['']);
  }

  goCheckout() {
    const ingressosSelecionados = this.evento.ingressos.filter((ingresso: any) => ingresso.quantidade > 0);
    this.router.navigate(['/checkout'], {
      state: { produtos: ingressosSelecionados }
    });
  }
}
