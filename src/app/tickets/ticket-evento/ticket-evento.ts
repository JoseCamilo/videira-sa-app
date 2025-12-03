import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ticket-evento',
  imports: [],
  templateUrl: './ticket-evento.html',
  styleUrl: './ticket-evento.scss',
})
export class TicketEvento {

  @Input() id!: string;
  @Input() titulo!: string;
  @Input() nome!: string;
  @Input() data!: string;
  @Input() imagem!: string;
  @Input() qrcode!: string;
  @Input() descricao!: string;
  @Input() status!: string;

  showQRCode = false;
  loaded = false;

}
