import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Loading } from '../../../loading/loading';
import { FirestoreDatePipe } from '../../../pipes/firestore-date.pipe';
import { CurrencyFormatPipe } from '../../../pipes/currency.pipe';
import { PedidosCompraService } from '../pedidos-compra.service';

@Component({
  selector: 'app-detalhes-pedido-compra',
  standalone: true,
  imports: [CommonModule, Loading, FirestoreDatePipe, CurrencyFormatPipe],
  templateUrl: './detalhes-pedido-compra.html',
  styleUrl: './detalhes-pedido-compra.scss'
})
export class DetalhesPedidoCompraComponent implements OnInit {
  private service = inject(PedidosCompraService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pedido: any = null;
  carregando = true;

  ngOnInit() {
    const paymentId = this.route.snapshot.queryParamMap.get('id');
    if (paymentId) {
      this.carregarPedido(+paymentId);
    }
  }

  carregarPedido(paymentId: number) {
    this.carregando = true;
    this.service.getPaymentOrderById(paymentId).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  voltar() {
    this.router.navigate(['/pedidos-compra']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
