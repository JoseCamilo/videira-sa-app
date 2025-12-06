import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardVendasService, VendasMetricas, VendasPorMes } from './dashboard-vendas.service';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';
import { Loading } from '../../loading/loading';

@Component({
  selector: 'app-dashboard-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe, Loading],
  templateUrl: './dashboard-vendas.html',
  styleUrl: './dashboard-vendas.scss'
})
export class DashboardVendasComponent implements OnInit {
  private dashboardService = inject(DashboardVendasService);

  // Filtros
  anoSelecionado: number = new Date().getFullYear();
  mesSelecionado: number = new Date().getMonth() + 1;
  diaSelecionado?: number;
  tipoFiltro: 'dia' | 'mes' | 'ano' = 'mes';

  // Dados
  metricas: VendasMetricas | null = null;
  vendasPorMes: VendasPorMes[] = [];
  loading = false;
  loadingGrafico = false;

  // Listas para seletores
  anos: number[] = [];
  meses = [
    { valor: 1, label: 'Janeiro' },
    { valor: 2, label: 'Fevereiro' },
    { valor: 3, label: 'Março' },
    { valor: 4, label: 'Abril' },
    { valor: 5, label: 'Maio' },
    { valor: 6, label: 'Junho' },
    { valor: 7, label: 'Julho' },
    { valor: 8, label: 'Agosto' },
    { valor: 9, label: 'Setembro' },
    { valor: 10, label: 'Outubro' },
    { valor: 11, label: 'Novembro' },
    { valor: 12, label: 'Dezembro' }
  ];

  ngOnInit(): void {
    this.inicializarAnos();
    this.carregarDados();
  }

  private inicializarAnos(): void {
    const anoAtual = new Date().getFullYear();
    this.anos = [];
    for (let i = anoAtual - 5; i <= anoAtual; i++) {
      this.anos.push(i);
    }
  }

  onTipoFiltroChange(): void {
    this.carregarDados();
  }

  onFiltroChange(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    
    let dataInicio: Date;
    let dataFim: Date;

    switch (this.tipoFiltro) {
      case 'dia':
        const dia = this.diaSelecionado || new Date().getDate();
        dataInicio = new Date(this.anoSelecionado, this.mesSelecionado - 1, dia, 0, 0, 0);
        dataFim = new Date(this.anoSelecionado, this.mesSelecionado - 1, dia, 23, 59, 59);
        break;

      case 'mes':
        dataInicio = new Date(this.anoSelecionado, this.mesSelecionado - 1, 1, 0, 0, 0);
        dataFim = new Date(this.anoSelecionado, this.mesSelecionado, 0, 23, 59, 59);
        break;

      case 'ano':
        dataInicio = new Date(this.anoSelecionado, 0, 1, 0, 0, 0);
        dataFim = new Date(this.anoSelecionado, 11, 31, 23, 59, 59);
        break;

      default:
        dataInicio = new Date();
        dataFim = new Date();
    }

    this.dashboardService.getMetricasPorPeriodo(this.tipoFiltro, dataInicio, dataFim).subscribe({
      next: (metricas) => {
        this.metricas = metricas;
        this.loading = false;
        
        // Carregar gráfico de vendas por mês se for por ano
        if (this.tipoFiltro === 'ano') {
          this.carregarVendasPorMes();
        } else {
          // Limpar dados de vendas por mês se não for ano
          this.vendasPorMes = [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar métricas:', err);
        this.loading = false;
      }
    });
  }

  private carregarVendasPorMes(): void {
    this.loadingGrafico = true;
    this.dashboardService.getVendasPorMes(this.anoSelecionado).subscribe({
      next: (dados) => {
        this.vendasPorMes = dados;
        this.loadingGrafico = false;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas por mês:', err);
        this.loadingGrafico = false;
      }
    });
  }

  obterDiasMes(): number[] {
    const dias = [];
    const ultimoDia = new Date(this.anoSelecionado, this.mesSelecionado, 0).getDate();
    for (let i = 1; i <= ultimoDia; i++) {
      dias.push(i);
    }
    return dias;
  }

  getTotalVendasAno(): number { 
    return this.vendasPorMes.reduce((sum, m) => sum + m.valor, 0);
  }

  obterMaximoVendas(): number {
    if (!this.vendasPorMes || this.vendasPorMes.length === 0) return 1;
    const maximo = Math.max(...this.vendasPorMes.map(m => m.valor));
    return maximo > 0 ? maximo : 1;
  }
}
