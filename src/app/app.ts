import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from "./menu/menu";
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  firestore = inject(Firestore);

  ngOnInit(): void {
    
    getDocs(collection(this.firestore, "testPath")).then((response) => {
      console.log(response.docs[0].data())
    });
  }
}
