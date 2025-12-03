import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exclusao-dados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exclusao-dados.html',
  styleUrl: './exclusao-dados.scss',
})
export class ExclusaoDados {
  router: Router = inject(Router);
  dataAtualizacao: string = new Date().toLocaleDateString('pt-BR');

  goBack() {
    this.router.navigate(['']);
  }

  irParaPerfil() {
    this.router.navigate(['/perfil']);
  }
}
