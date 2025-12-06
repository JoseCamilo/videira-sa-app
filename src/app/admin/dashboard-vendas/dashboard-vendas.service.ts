import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, QueryConstraint, orderBy } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface VendasMetricas {
  totalVendas: number;
  quantidadePedidosAprovados: number;
  quantidadePedidosPendentes: number;
  quantidadeTickets: number;
  ticketsAtivos: number;
  ticketsInativos: number;
}

export interface VendasPorMes {
  mes: string;
  valor: number;
  pedidos: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardVendasService {
  firestore = inject(Firestore);

  getMetricasPorPeriodo(
    tipo: 'dia' | 'mes' | 'ano',
    dataInicio: Date,
    dataFim: Date
  ): Observable<VendasMetricas> {
    return from(this.calcularMetricas(tipo, dataInicio, dataFim)).pipe(
      catchError(err => {
        console.error('Erro ao calcular métricas:', err);
        return of({
          totalVendas: 0,
          quantidadePedidosAprovados: 0,
          quantidadePedidosPendentes: 0,
          quantidadeTickets: 0,
          ticketsAtivos: 0,
          ticketsInativos: 0
        });
      })
    );
  }

  private async calcularMetricas(
    tipo: 'dia' | 'mes' | 'ano',
    dataInicio: Date,
    dataFim: Date
  ): Promise<VendasMetricas> {
    try {
      const ordersRef = collection(this.firestore, 'paymentOrders');
      const ticketsRef = collection(this.firestore, 'tickets');

      const ordersQuery = query(
        ordersRef,
        where('createdAt', '>=', dataInicio),
        where('createdAt', '<=', dataFim),
        orderBy('createdAt', 'desc')
      );

      const ticketsQuery = query(
        ticketsRef,
        where('data', '>=', dataInicio),
        where('data', '<=', dataFim)
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const ticketsSnapshot = await getDocs(ticketsQuery);

      let totalVendas = 0;
      let quantidadePedidosAprovados = 0;
      let quantidadePedidosPendentes = 0;

      ordersSnapshot.docs.forEach(doc => {
        const dados = doc.data();
        totalVendas += dados['transaction_amount'] || 0;
        
        if (dados['status'] === 'approved') {
          quantidadePedidosAprovados++;
        } else if (dados['status'] === 'pending') {
          quantidadePedidosPendentes++;
        }
      });

      let ticketsAtivos = 0;
      let ticketsInativos = 0;

      ticketsSnapshot.docs.forEach(doc => {
        const dados = doc.data();
        if (dados['ativo']) {
          ticketsAtivos++;
        } else {
          ticketsInativos++;
        }
      });

      return {
        totalVendas,
        quantidadePedidosAprovados,
        quantidadePedidosPendentes,
        quantidadeTickets: ticketsSnapshot.docs.length,
        ticketsAtivos,
        ticketsInativos
      };
    } catch (err) {
      console.error('Erro ao calcular métricas:', err);
      throw err;
    }
  }

  getVendasPorMes(ano: number): Observable<VendasPorMes[]> {
    return from(this.calcularVendasPorMes(ano)).pipe(
      catchError(err => {
        console.error('Erro ao calcular vendas por mês:', err);
        return of([]);
      })
    );
  }

  private async calcularVendasPorMes(ano: number): Promise<VendasPorMes[]> {
    try {
      const ordersRef = collection(this.firestore, 'paymentOrders');
      const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
      
      const vendasPorMes: VendasPorMes[] = [];

      for (let mes = 0; mes < 12; mes++) {
        const dataInicio = new Date(ano, mes, 1, 0, 0, 0);
        const dataFim = new Date(ano, mes + 1, 0, 23, 59, 59);

        try {
          // Query para cada mês - sem status constraint
          const monthQuery = query(
            ordersRef,
            where('createdAt', '>=', dataInicio),
            where('createdAt', '<=', dataFim),
            orderBy('createdAt', 'desc')
          );

          const snapshot = await getDocs(monthQuery);

          let valor = 0;
          let pedidosAprovados = 0;

          snapshot.docs.forEach((doc) => {
            const dados = doc.data();
            const status = dados['status'];
            const amount = dados['transaction_amount'] || 0;
            
            // Contar apenas aprovados
            if (status === 'approved') {
              valor += amount;
              pedidosAprovados++;
            }
          });

          vendasPorMes.push({
            mes: meses[mes],
            valor,
            pedidos: pedidosAprovados
          });
        } catch (monthErr) {
          vendasPorMes.push({
            mes: meses[mes],
            valor: 0,
            pedidos: 0
          });
        }
      }

      return vendasPorMes;
    } catch (err) {
      console.error('Erro ao calcular vendas por mês:', err);
      throw err;
    }
  }

  getTicketsPorEvento(): Observable<any[]> {
    return from(this.calcularTicketsPorEvento()).pipe(
      catchError(err => {
        console.error('Erro ao calcular tickets por evento:', err);
        return of([]);
      })
    );
  }

  private async calcularTicketsPorEvento(): Promise<any[]> {
    try {
      const ticketsRef = collection(this.firestore, 'tickets');
      const snapshot = await getDocs(ticketsRef);

      const eventoMap = new Map<string, { ativo: number; inativo: number }>();

      snapshot.docs.forEach(doc => {
        const dados = doc.data();
        const eventoId = dados['evento'];
        
        if (!eventoMap.has(eventoId)) {
          eventoMap.set(eventoId, { ativo: 0, inativo: 0 });
        }

        const evento = eventoMap.get(eventoId)!;
        if (dados['ativo']) {
          evento.ativo++;
        } else {
          evento.inativo++;
        }
      });

      return Array.from(eventoMap.entries()).map(([evento, stats]) => ({
        evento,
        ativo: stats.ativo,
        inativo: stats.inativo,
        total: stats.ativo + stats.inativo
      }));
    } catch (err) {
      console.error('Erro ao calcular tickets por evento:', err);
      throw err;
    }
  }
}
