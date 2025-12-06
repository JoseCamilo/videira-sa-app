import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Loading } from '../../loading/loading';
import { FirestoreDatePipe } from '../../pipes/firestore-date.pipe';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';
import { PedidosCompraService, PaymentOrder } from './pedidos-compra.service';

@Component({
  selector: 'app-pedidos-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, Loading, FirestoreDatePipe, CurrencyFormatPipe],
  templateUrl: './pedidos-compra.html',
  styleUrl: './pedidos-compra.scss'
})
export class PedidosCompraComponent implements OnInit {
  private service = inject(PedidosCompraService);
  private router = inject(Router);

  pedidos: PaymentOrder[] = [];
  allPedidos: PaymentOrder[] = [];
  carregando = true;
  searchEmail = '';
  searchPaymentId = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPedidos = 0;
  totalPaginas = 0;
  Math = Math;

  ngOnInit() {
    this.inicializarFiltrosDatas();
    this.executarFiltros();
  }

  inicializarFiltrosDatas() {
    const hoje = new Date();
    const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
    const dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
    
    this.filtroDataInicio = this.formatarParaInputDateTime(dataInicio);
    this.filtroDataFim = this.formatarParaInputDateTime(dataFim);
  }

  formatarParaInputDateTime(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    
    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  carregarTodosPedidos() {
    this.carregando = true;
    this.paginaAtual = 1;
    this.service.getAllPaymentOrders().subscribe({
      next: (pedidos) => {
        this.allPedidos = pedidos;
        this.totalPedidos = pedidos.length;
        this.calcularPaginacao();
        this.atualizarPedidosExibidos();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  buscarPorEmail() {
    if (this.searchEmail.trim() === '') {
      this.carregarTodosPedidos();
      return;
    }
    
    this.carregando = true;
    this.paginaAtual = 1;
    this.service.searchPaymentOrders('email', this.searchEmail).subscribe({
      next: (pedidos) => {
        this.allPedidos = pedidos;
        this.totalPedidos = pedidos.length;
        this.calcularPaginacao();
        this.atualizarPedidosExibidos();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  buscarPorPaymentId() {
    if (this.searchPaymentId.trim() === '') {
      this.carregarTodosPedidos();
      return;
    }
    
    this.carregando = true;
    this.paginaAtual = 1;
    this.service.searchPaymentOrders('paymentId', +this.searchPaymentId).subscribe({
      next: (pedidos) => {
        this.allPedidos = pedidos;
        this.totalPedidos = pedidos.length;
        this.calcularPaginacao();
        this.atualizarPedidosExibidos();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  executarFiltros(): void {
    
    // Se houver filtro de payment ID, usar filtro de payment ID
    if (this.searchPaymentId.trim() !== '') {
      this.buscarPorPaymentId();
      return;
    }

    // Se houver filtro de email, usar filtro de email
    if (this.searchEmail.trim() !== '') {
      this.buscarPorEmail();
      return;
    }    

    // Se houver filtro de data, usar filtro de data
    if (this.filtroDataInicio && this.filtroDataFim) {
      this.filtrarPorData();
      return;
    }

    // Se não houver nenhum filtro, carregar todos
    this.carregarTodosPedidos();
  }

  limparFiltros() {
    this.searchEmail = '';
    this.searchPaymentId = '';
    this.inicializarFiltrosDatas();
    this.carregarTodosPedidos();
  }

  filtrarPorData() {
    if (!this.filtroDataInicio || !this.filtroDataFim) {
      this.carregarTodosPedidos();
      return;
    }

    this.carregando = true;
    this.paginaAtual = 1;
    
    const dataInicio = new Date(this.filtroDataInicio);
    const dataFim = new Date(this.filtroDataFim);

    this.service.searchPaymentOrdersByDateRange(dataInicio, dataFim).subscribe({
      next: (pedidos) => {
        this.allPedidos = pedidos;
        this.totalPedidos = pedidos.length;
        this.calcularPaginacao();
        this.atualizarPedidosExibidos();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
      complete: () => { this.carregando = false; }
    });
  }

  calcularPaginacao() {
    this.totalPaginas = Math.ceil(this.totalPedidos / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas;
    }
  }

  atualizarPedidosExibidos() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.pedidos = this.allPedidos.slice(inicio, fim);
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.atualizarPedidosExibidos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual + 1);
  }

  obterPaginasDisponiveis(): number[] {
    const paginas: number[] = [];
    const maxBotoes = 5;
    const metade = Math.floor(maxBotoes / 2);
    let inicio = Math.max(1, this.paginaAtual - metade);
    let fim = Math.min(this.totalPaginas, this.paginaAtual + metade);

    if (fim - inicio + 1 < maxBotoes) {
      if (inicio === 1) {
        fim = Math.min(this.totalPaginas, inicio + maxBotoes - 1);
      } else {
        inicio = Math.max(1, fim - maxBotoes + 1);
      }
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  verDetalhes(paymentId: string) {
    this.router.navigate(['/pedidos-compra/detalhes'], { queryParams: { id: paymentId } });
  }

  goBack() {
    window.history.back();
  }
}
