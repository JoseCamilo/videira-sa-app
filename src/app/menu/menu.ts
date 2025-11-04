import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  
  router: Router = inject(Router);
  
  isShownMoremodal = false;
  itemActive = 1;
  
  openLink(link: string) {
    this.router.navigate([link]);
  }
}
 
