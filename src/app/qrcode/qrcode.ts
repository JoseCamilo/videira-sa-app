import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from 'angularx-qrcode';
import { StorageService } from '../storage/storage.service';
import { Ticket, TicketService } from '../tickets/tickets.service';
import { EventoService } from '../eventos/evento.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-qrcode',
  imports: [QRCodeComponent],
  templateUrl: './qrcode.html',
  styleUrl: './qrcode.scss',
})
export class Qrcode {

  myTextQrCode: string = "";

  @ViewChild('qrcode', { static: false }) qrcodeinput!: ElementRef | any;

  storageService = inject(StorageService);
  ticketService = inject(TicketService);
  eventoService = inject(EventoService);

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const conteudo = reader.result as string;
        // console.log('Conteúdo do arquivo:', conteudo);

        const ticktes = JSON.parse(conteudo);
        for (let i = 0; i < ticktes.length; i++) {
          await this.processaTicket(ticktes[i]);
        }
      };

      reader.onerror = (err) => {
        console.error('Erro ao ler arquivo:', err);
      };

      reader.readAsText(file);
    }
  }


  processaTicket(ticket: Ticket): Promise<void> {
    return new Promise((resolve) => {

      ticket['ativo'] = true;

      this.eventoService.getEventoById(ticket.evento)
      .pipe(take(1))
      .subscribe({
        next: (evento) => {
          
          ticket['imagem'] = evento?.imagem || '';
          ticket['titulo'] = evento?.titulo || '';
          ticket['local'] = evento?.local || '';
          ticket['hora'] = evento?.hora || '';
          ticket['date'] = evento?.date || new Date();

          // criar ticket parcial no firestore pra pegar o ID
          this.ticketService.addTicket(ticket)
          .then((data) => {
            // salvar id no objeto
            ticket['id'] = data.id;
            
            // gerar qrcode
            this.myTextQrCode = `{"id":"${ticket.id}","evento":"${ticket.evento}","titulo":"${ticket.titulo}","nome":"${ticket.nome}"}`;
            this.tarefaComSleep().then(() => {

              const base64 = this.geraQRCode(ticket);
        
              // salvar a imagem no storage
              const nomeArquivo = `${ticket.evento}/qr-${ticket.id}.png`;
              this.storageService.uploadTicket(base64, nomeArquivo)
              .then((url) => {
        
                // pegar url da imagem salvar no objeto
                ticket['qrcode'] = url;
                
                // salvar o ticket no firestore
                this.ticketService.updateTicket(ticket)
                .then(() => {
                  // incrementar ticket vendido no evento
                  this.eventoService.confirmTicketVendidoInEvento(ticket.evento);

                  this.ticketService.sendEmailTicket(ticket);
      
                  console.log('Sucesso ticket:', ticket);
                  return resolve();
                })
                .catch((erro) => {
                  console.error('Erro update ticket:', erro);
                  return resolve();
                });
              })
              .catch((erro) => {
                console.error('Erro upload ticket:', erro);
                return resolve();
              });
            })
          })
          .catch((erro) => {
            console.error('Erro ao adicionar ticket:', erro);
            return resolve();
          });
        },
        error: (erro) => {
          console.error('Erro ao consultar ticket:', erro);
          return resolve();
        }
      });
    });
  }
  
  geraQRCode(ticket: Ticket) {
    

    const canvas: HTMLCanvasElement = this.qrcodeinput.qrcElement.nativeElement.querySelector('canvas');
    return canvas.toDataURL('image/png');   
  }

  tarefaComSleep(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }



  // Download local
  // public qrCodeDownloadLink: SafeUrl = "";
  // onChangeURL(url: SafeUrl) {
  //   this.qrCodeDownloadLink = url;
  // }
}
