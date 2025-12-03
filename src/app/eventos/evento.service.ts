import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy, limit, QueryConstraint, startAfter, doc, docData, Timestamp, updateDoc, increment, getDocs } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProdutoPedido } from '../checkout/checkout';

export interface Evento {
  id: string;       // ID do documento
  titulo: string;
  data: string;
  date: Date;
  local: string;
  hora: string;
  imagem: string;
  ativo: boolean;
  vendidos?: {
    count: number;
    total: number;
  };
  presentes?: {
    count: number;
    total: number;
  };
  ingressos: ProdutoPedido[];
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  firestore = inject(Firestore)

  getEventosAtivos(pageSize = 50, lastDoc?: any, date?: any, type?: any, local?: any): Observable<Evento[]> {
    const eventosRef = collection(this.firestore, 'eventos');

    const constraints: QueryConstraint[] = [
      where('ativo', '==', true),
    ];

    if (date) {
      const inicio = Timestamp.fromDate(new Date(date + 'T00:00:00'));
      const fim = Timestamp.fromDate(new Date(date + 'T23:59:59'));

      constraints.push(where('date', '>=', inicio));
      constraints.push(where('date', '<=', fim));
    }

    if (type) {
      constraints.push(where('type', '==', type));
    }

    if (local) {
      constraints.push(where('local', '==', local));
    }

    constraints.push(orderBy('date'));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const eventosQuery = query(eventosRef, ...constraints);

    return from(getDocs(eventosQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          titulo: doc.data()['titulo'],
          imagem: doc.data()['imagem'],
          data: doc.data()['data'],
          local: doc.data()['local'],
          presentes: doc.data()['presentes'],
          vendidos: doc.data()['vendidos'],
          date: doc.data()['date'].toDate(),
        } as any))
      ),
      catchError(err => {
        console.error('Erro ao buscar eventos:', err);
        return of([]);
      })
    );
  }

  getEventoById(id: string): Observable<Evento | null> {
    const eventoRef = doc(this.firestore, `eventos/${id}`);
    return (docData(eventoRef, { idField: 'id' }) as Observable<Evento | null>).pipe(
      catchError(err => {
        console.error(`Erro ao buscar evento com ID ${id}:`, err);
        return of(null);
      })
    );
  }

  getAllEventos(pageSize = 10, lastDoc?: any): Observable<Evento[]> {
    const eventosRef = collection(this.firestore, 'eventos');

    const constraints: QueryConstraint[] = [
      orderBy('date'),
      limit(pageSize)
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const eventosQuery = query(eventosRef, ...constraints);

    return (collectionData(eventosQuery, { idField: 'id' }) as Observable<Evento[]>).pipe(
      catchError(err => {
        console.error('Erro ao buscar eventos:', err);
        return of([]);
      })
    );
  }

  confirmConvidadoPresenteInEvento(id: string): Promise<any> {
    const eventoRef = doc(this.firestore, `eventos/${id}`);

    return updateDoc(eventoRef, {
      'presentes.count': increment(1)
    });
  }

  confirmTicketVendidoInEvento(id: string): Promise<any> {
    const eventoRef = doc(this.firestore, `eventos/${id}`);

    return updateDoc(eventoRef, {
      'vendidos.count': increment(1),
      'presentes.total': increment(1)
    });
  }
}