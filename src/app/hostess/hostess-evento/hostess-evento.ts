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

  @Input() id!: string;
  @Input() titulo!: string;
  @Input() data!: string;
  @Input() imagem!: string;
  @Input() vendidosCount: number = 0;
  @Input() vendidosTotal: number = 0;
  @Input() presentesCount: number = 0;
  @Input() presentesTotal: number = 0;

  openScanner() {
    this.router.navigate(['scanner', this.id]);
  }

}
