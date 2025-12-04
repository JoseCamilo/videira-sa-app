import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento, EventoService } from '../../eventos/evento.service';
import { take } from 'rxjs';
import { Loading } from '../../loading/loading';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Ticket, TicketService } from '../../tickets/tickets.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-scanner',
  imports: [ZXingScannerModule, Loading, DecimalPipe, CommonModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner implements OnInit, OnDestroy {

  router: Router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
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

        this.eventoService.confirmConvidadoPresenteInEvento(this.scannedResult.evento, this.authService.user.email, new Date().toLocaleDateString('pt-BR'))
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

      this.ticketService.getTicketById(this.scannedResult.id)
        .pipe(take(1))
        .subscribe({
          next: (item) => {
            this.scannedResult['tipo'] = item?.tipo || '-';

            if (this.evento.id !== this.scannedResult.evento) {
              this.isTicketInvalidado = true;
              this.textErroTicket = 'Parece que este ticket é de outro Evento';
            } else if (!(item?.ativo)) {
              this.isTicketInvalidado = true;
              this.textErroTicket = 'Parece que este ticket já foi utilizado ou esta inativo';
            } else {
              this.isTicketValidado = true;
            }

            this.validando = false;
          },
          complete: () => this.validando = false,
          error: () => this.validando = false
        });

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

    if (error.name === 'NotReadableError') {
      this.statusScanner = 'Câmera indisponível. Verifique se outro app está usando a câmera.';
    } else if (error.name === 'NotAllowedError' || error.message?.includes('Permission')) {
      this.statusScanner = 'Permissão de câmera negada. Ative nas configurações.';
    } else if (error.name === 'NotFoundError') {
      this.statusScanner = 'Nenhuma câmera encontrada no dispositivo.';
    } else {
      this.statusScanner = 'Erro ao acessar câmera. Tente novamente.';
    }
  }

  toggleCamera() {
    if (this.availableDevices.length > 1) {
      this.currentDeviceIndex = (this.currentDeviceIndex + 1) % this.availableDevices.length;
      this.selectedDevice = this.availableDevices[this.currentDeviceIndex];
    }
  }

}
