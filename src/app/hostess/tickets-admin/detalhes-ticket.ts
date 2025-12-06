import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Loading } from '../../loading/loading';
import { FirestoreDatePipe } from '../../pipes/firestore-date.pipe';
import { TicketsAdminService } from './tickets-admin.service';

export interface Ticket {
  id: string;
  evento: string;
  titulo: string;
  nome: string;
  email: string;
  ativo: boolean;
  qrcode: string;
  data: any;
  imagem: string;
  date: any;
  local: string;
  hora: string;
  telefone: string;
  tipo: string;
  descricao: string;
  status: string;
  paymentStatus: string;
  dataCriacao: any;
  igreja: string;
  funcao: string;
  pastor: string;
}

@Component({
  selector: 'app-detalhes-ticket',
  standalone: true,
  imports: [CommonModule, Loading, FirestoreDatePipe],
  templateUrl: './detalhes-ticket.html',
  styleUrl: './detalhes-ticket.scss'
})
export class DetalhesTicketComponent implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  ticketsAdminService: TicketsAdminService = inject(TicketsAdminService);
  ticket: Ticket | null = null;
  carregando: boolean = true;



  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.carregarTicket(params['id']);
      } else {
        this.carregando = false;
      }
    });
  }

  carregarTicket(id: string): void {
    this.carregando = true;
    this.ticketsAdminService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar ticket:', err);
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  voltar(): void {
    this.router.navigate(['/tickets-admin'], { queryParams: { evento: this.ticket?.evento } });
  }
}
