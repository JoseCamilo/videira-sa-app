import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-termos-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './termos-servico.html',
  styleUrl: './termos-servico.scss',
})
export class TermosServico {
  router: Router = inject(Router);
  dataAtualizacao: string = new Date().toLocaleDateString('pt-BR');

  goBack() {
    this.router.navigate(['']);
  }
}
