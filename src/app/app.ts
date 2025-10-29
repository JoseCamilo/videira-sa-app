import { Component, signal } from '@angular/core';
import { Instalacao } from './instalacao/instalacao';

@Component({
  selector: 'app-root',
  imports: [Instalacao],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('myapp');
}
