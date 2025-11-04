import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  firestore = inject(Firestore);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0});
    });
  }


  ngOnInit(): void {
    
    getDocs(collection(this.firestore, "testPath")).then((response) => {
      console.log(response.docs[0].data())
    });
  }
}
