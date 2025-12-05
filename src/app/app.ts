import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { NotificationComponent } from './notification/notification';
import { Footer } from './footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, NotificationComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0});
    });
  }
}
