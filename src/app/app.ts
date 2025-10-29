import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { Instalacao } from './instalacao/instalacao';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Instalacao],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
