import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventoService } from '../../eventos/evento.service';
import { take } from 'rxjs';
import { Loading } from '../../loading/loading';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Ticket, TicketService } from '../../tickets/tickets.service';

@Component({
  selector: 'app-scanner',
  imports: [ZXingScannerModule, Loading, DecimalPipe, CommonModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner implements OnInit, OnDestroy {

  router: Router = inject(Router);
  route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id') || '';

  ticketService = inject(TicketService);
  eventoService = inject(EventoService);
  evento: Evento | any;

  carregando = false;
  validando = false;
  confirmando = false;
  isShowResultModal = false;

  isTicketValidado = false
  isTicketInvalidado = false
  textErroTicket = ''

  ngOnInit(): void {
    this.carregarEvento();

    // this.isShowResultModal = true;
    // this.statusScanner = 'Aguardando...'
    // this.scannedResult = JSON.parse('{"id":"0MeOVIV5yQysPau2K9g7","evento":"7WFp264Ztm2H6g6SnwbF","titulo":"Next Level 2025","nome":"José Fernando Camilo"}');
  }

  ngOnDestroy(): void {
    this.evento = null;
  }

  carregarEvento() {
    this.eventoService.getEventoById(this.id)
      .subscribe({
        next: (item) => {
          this.evento = item;
          this.carregando = false;
        },
        error: () => this.carregando = false,
        complete: () => this.carregando = false
      });
  }

  goBack() {
    this.router.navigate(['hostess']);
  }

  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC];
  scannedResult: Ticket | any = null;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;
  currentDeviceIndex = 0;
  statusScanner = 'Escaneando QR Code...';

  confirmTicket() {
    this.confirmando = true;
    this.statusScanner = 'Escaneando QR Code...';

    this.ticketService.confirmTicketAcesso(this.scannedResult.id)
      .then(() => {

        this.eventoService.confirmConvidadoPresenteInEvento(this.scannedResult.evento)
          .then(() => {
            this.isShowResultModal = false;
            this.confirmando = false;
          }).catch((error) => {
            this.confirmando = false;
            console.error('Erro ao atualizar Evento:', error);
          });

      }).catch((error) => {
        this.confirmando = false;
        console.error('Erro ao atualizar Ticket:', error);
      });

  }

  cancelTicket() {
    this.isShowResultModal = false;
    this.statusScanner = 'Escaneando QR Code...';
  }

  onCodeResult(result: string) {
    if (!this.isShowResultModal) {
      this.textErroTicket = '';
      this.validando = true;
      this.statusScanner = 'Aguardando...'
      this.scannedResult = JSON.parse(result);
      this.isTicketInvalidado = false;
      this.isTicketValidado = false;
      this.isShowResultModal = true;

      if (this.evento.id === this.scannedResult.evento) {
        this.ticketService.getTicketById(this.scannedResult.id)
          .pipe(take(1))
          .subscribe({
            next: (item) => {
              if (item?.ativo) {
                this.isTicketValidado = true;

                this.scannedResult['tipo'] = item?.tipo || '1° LOTE';
              } else {
                this.isTicketInvalidado = true;
                this.textErroTicket = 'Parece que este ticket já foi utilizado ou esta inativo';
              }
              this.validando = false;
            },
            complete: () => this.validando = false,
            error: () => this.validando = false
          });
      } else {
        this.validando = false;
        this.isTicketInvalidado = true;
        this.textErroTicket = 'Parece que este ticket é de outro Evento';
      }
    }
  }

  onHasDevices() {
    console.error('onHasDevices: cameras Not Found');
  }

  onDevicesFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices.filter(device => device.kind === 'videoinput');
    if (this.availableDevices.length > 0) {
      this.selectedDevice = this.availableDevices[0];
    }
  }

  onError(error: any) {
    console.error('Erro ao escanear:', error);
  }

  toggleCamera() {
    if (this.availableDevices.length > 1) {
      this.currentDeviceIndex = (this.currentDeviceIndex + 1) % this.availableDevices.length;
      this.selectedDevice = this.availableDevices[this.currentDeviceIndex];
    }
  }

}
