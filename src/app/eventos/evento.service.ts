import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy, limit, QueryConstraint, startAfter, doc, docData, Timestamp, updateDoc, increment } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ticket } from '../tickets/tickets.service';

export interface Evento {
  id: string;       // ID do documento
  titulo: string;
  data: string;
  date: Date;
  local: string;
  hora: string;
  imagem: string;
  ativo: boolean;
  vendidos: {
    count: number;
    total: number;
  };
  presentes: {
    count: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  firestore = inject(Firestore)

  getEventosAtivos(pageSize = 10, lastDoc?: any, date?: any, type?: any, local?: any): Observable<Evento[]> {
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

    return (collectionData(eventosQuery, { idField: 'id' }) as Observable<Evento[]>).pipe(
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