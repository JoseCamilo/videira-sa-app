import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where, orderBy, limit, QueryConstraint, startAfter, doc, docData, Timestamp, updateDoc, increment, addDoc, getDocs } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Ticket {
  id: string;
  evento: string;
  titulo: string;
  nome: string;
  email: string;
  ativo: boolean;
  qrcode: string;
  data: string;
  imagem: string;
  date: Date;
  local: string;
  hora: string;
  telefone: string;
  tipo: string;
  descricao: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  firestore = inject(Firestore)

  getTicketsAtivos(pageSize = 10, lastDoc?: any): Observable<Ticket[]> {
    const ticketsRef = collection(this.firestore, 'tickets');

    const constraints: QueryConstraint[] = [
      where('ativo', '==', true),
      orderBy('date'),
      limit(pageSize)
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const ticketsQuery = query(ticketsRef, ...constraints);

    return (collectionData(ticketsQuery, { idField: 'id' }) as Observable<Ticket[]>).pipe(
      catchError(err => {
        console.error('Erro ao buscar tickets:', err);
        return of([]);
      })
    );
  }

  getMeusTicketsAtivos(email: string, pageSize = 100, lastDoc?: any): Observable<Ticket[]> {
    const ticketsRef = collection(this.firestore, 'tickets');

    const constraints: QueryConstraint[] = [
      where('ativo', '==', true),
      where('email', '==', email),
      orderBy('date'),
      limit(pageSize)
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const ticketsQuery = query(ticketsRef, ...constraints);

    return from(getDocs(ticketsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Ticket))
      ),
      catchError(err => {
        console.error('Erro ao buscar tickets:', err);
        return of([]);
      })
    );
  }

  confirmTicketAcesso(id: string): Promise<any> {
    const eventoRef = doc(this.firestore, `tickets/${id}`);

    return updateDoc(eventoRef, {
      ativo: false
    });
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

  addTicket(ticket: Ticket) {
    const ref = collection(this.firestore, 'tickets');
    return addDoc(ref, ticket);
  }

  updateTicket(ticket: Ticket) {
    const ref = doc(this.firestore, `tickets/${ticket.id}`);
    let data = Object.assign(ticket);

    delete data.id;
    return updateDoc(ref, data);
  }

  sendEmailTicket(ticket: Ticket): Promise<any> {
    let email = {
      to: ticket.email,
      message: {
        subject: `Videira Tickets: ${ticket.titulo}!`,
        html: `
                <!DOCTYPE html>
                <html lang="pt-BR">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Seu ingresso está aqui!</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        padding: 20px;
                      }
                      .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 30px;
                        max-width: 600px;
                        margin: auto;
                        box-shadow: 0 0 10px rgba(0,0,0,0.05);
                      }
                      .header {
                        text-align: center;
                        color: #2c3e50;
                      }
                      .ticket {
                        background-color: #ecf0f1;
                        padding: 20px;
                        border-radius: 6px;
                        margin-top: 20px;
                        text-align: center;
                      }
                      .footer {
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #777;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h2 class="header">🎟️ Seu ingresso para o evento está aqui!</h2>

                      <p>Olá <strong>${ticket.nome}</strong>,</p>

                      <p>É com grande alegria que confirmamos sua inscrição no evento <strong>"${ticket.titulo}"</strong>, promovido pela nossa igreja.</p>

                      <div class="ticket">
                        <p><strong>📅 Data:</strong> ${ticket.data}</p>
                        <p><strong>🕒 Horário:</strong> ${ticket.hora}</p>
                        <p><strong>📍 Local:</strong> ${ticket.local}</p>
                      </div>

                      <p>Apresente este e-mail na entrada do evento. Se preferir, você pode imprimir ou salvar o QR Code abaixo:</p>

                      <p style="text-align: center;">
                        <img src="${ticket.qrcode}" alt="QR Code do ingresso" />
                      </p>

                      <p>Acreditamos que Deus tem algo especial reservado para você neste evento. Que seja um tempo de profunda edificação e graça!</p>

                      <div class="footer">
                        Igreja Videira Santo André
                      </div>
                    </div>
                  </body>
                </html>
                `,
      }
    }

    const ref = collection(this.firestore, 'mail');
    return addDoc(ref, email);
  }

}