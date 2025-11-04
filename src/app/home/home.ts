import { Component } from '@angular/core';
import { Eventos } from '../eventos/eventos';
import { Instalacao } from '../instalacao/instalacao';

@Component({
  selector: 'app-home',
  imports: [Eventos, Instalacao],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
