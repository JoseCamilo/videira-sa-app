import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politica-privacidade.html',
  styleUrl: './politica-privacidade.scss',
})
export class PoliticaPrivacidade {
  router: Router = inject(Router);
  dataAtualizacao: string = new Date().toLocaleDateString('pt-BR');
  
  goBack() {
    this.router.navigate(['']);
  }
}
