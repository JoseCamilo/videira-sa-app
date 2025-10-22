import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-evento',
  imports: [],
  templateUrl: './evento.html',
  styleUrl: './evento.css'
})
export class Evento {

  @Input() titulo!: string;
  @Input() data!: string;
  @Input() local!: string;
  @Input() imagem!: string;


}
