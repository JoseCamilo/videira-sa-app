import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, QueryConstraint, doc, docData } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Ticket } from './detalhes-ticket';

export interface TicketListItem {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsAdminService {
  firestore = inject(Firestore);

  getAllTicketsByEvent(evento: string): Observable<TicketListItem[]> {
    const ticketsRef = collection(this.firestore, 'tickets');

    const ticketsQuery = query(ticketsRef, where('evento', '==', evento));
    
    return from(getDocs(ticketsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TicketListItem))
      ),
      catchError(err => {
        console.error('Erro ao buscar tickets:', err);
        return of([]);
      })
    );
  }

  searchTicketsByEmail(email: string): Observable<TicketListItem[]> {
    const ticketsRef = collection(this.firestore, 'tickets');
    
    const ticketsQuery = query(ticketsRef, where('email', '==', email));

    return from(getDocs(ticketsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TicketListItem))
      ),
      catchError(err => {
        console.error('Erro ao buscar tickets:', err);
        return of([]);
      })
    );
  }

  getTicketById(id: string): Observable<Ticket | null> {
    const eventoRef = doc(this.firestore, `tickets/${id}`);
    return (docData(eventoRef, { idField: 'id' }) as Observable<Ticket | null>).pipe(
      catchError(err => {
        console.error(`Erro ao buscar ticket com ID ${id}:`, err);
        return of(null);
      })
    );
  }
}
