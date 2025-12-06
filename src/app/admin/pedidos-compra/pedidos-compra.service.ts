import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, QueryConstraint, doc, getDoc, orderBy } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface PaymentOrder {
  id: string;
  paymentId: string;
  payerEmail: string;
  status: string;
  createdAt: any;
  transaction_amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosCompraService {
  firestore = inject(Firestore);

  getAllPaymentOrders(): Observable<PaymentOrder[]> {
    const ordersRef = collection(this.firestore, 'paymentOrders');
    
    return from(getDocs(query(ordersRef, orderBy('createdAt', 'desc')))).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PaymentOrder))
      ),
      catchError(err => {
        console.error('Erro ao buscar pedidos:', err);
        return of([]);
      })
    );
  }

  searchPaymentOrders(searchType: 'email' | 'paymentId', searchValue: string | number): Observable<PaymentOrder[]> {
    const ordersRef = collection(this.firestore, 'paymentOrders');
    
    let constraints: QueryConstraint[] = [];
    
    if (searchType === 'email') {
      constraints = [where('payerEmail', '==', searchValue), orderBy('createdAt', 'desc')];
    } else if (searchType === 'paymentId') {
      constraints = [where('paymentId', '==', searchValue), orderBy('createdAt', 'desc')];
    }

    const ordersQuery = query(ordersRef, ...constraints);

    return from(getDocs(ordersQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PaymentOrder))
      ),
      catchError(err => {
        console.error('Erro ao buscar pedidos:', err);
        return of([]);
      })
    );
  }

  getPaymentOrderById(paymentId: number): Observable<any> {
    const ordersRef = collection(this.firestore, 'paymentOrders');
    
    return from(getDocs(query(ordersRef, where('paymentId', '==', paymentId), orderBy('createdAt', 'desc')))).pipe(
      map(snapshot => {
        if (snapshot.docs.length > 0) {
          return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
          };
        }
        return null;
      }),
      catchError(err => {
        console.error('Erro ao buscar pedido:', err);
        return of(null);
      })
    );
  }

  searchPaymentOrdersByDateRange(dataInicio: Date, dataFim: Date): Observable<PaymentOrder[]> {
    const ordersRef = collection(this.firestore, 'paymentOrders');
    
    const constraints: QueryConstraint[] = [
      where('createdAt', '>=', dataInicio),
      where('createdAt', '<=', dataFim),
      orderBy('createdAt', 'desc')
    ];

    const ordersQuery = query(ordersRef, ...constraints);

    return from(getDocs(ordersQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PaymentOrder))
      ),
      catchError(err => {
        console.error('Erro ao buscar pedidos por data:', err);
        return of([]);
      })
    );
  }
}
