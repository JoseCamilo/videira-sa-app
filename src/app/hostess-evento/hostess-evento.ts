import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hostess-evento',
  imports: [],
  templateUrl: './hostess-evento.html',
  styleUrl: './hostess-evento.scss',
})
export class HostessEvento {

  router: Router = inject(Router);

  @Input() titulo = '';
  @Input() data = '';
  @Input() imagem = '';
  @Input() vendidosCount = 0;
  @Input() vendidosTotal = 0;
  @Input() presentesCount = 0;
  @Input() presentesTotal = 0;

  openLink(link: string) {
    this.router.navigate([link]);
  }

}
