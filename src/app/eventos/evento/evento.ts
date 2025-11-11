import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento',
  imports: [],
  templateUrl: './evento.html',
  styleUrl: './evento.css'
})
export class Evento {

  router: Router = inject(Router);

  @Input() id!: string;
  @Input() titulo!: string;
  @Input() data!: string;
  @Input() local!: string;
  @Input() imagem!: string;

  loaded = false;

  openDetalhes() {
    this.router.navigate(['evento', this.id]);
  }

}
