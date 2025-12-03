import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre-nos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nos.html',
  styleUrl: './sobre-nos.scss',
})
export class SobreNos {
  router: Router = inject(Router);

  goBack() {
    this.router.navigate(['']);
  }
}
