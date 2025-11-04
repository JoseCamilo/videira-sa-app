import { Component, Input, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  imports: [ZXingScannerModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner {

  @Input() title: string = 'Conferência Profética 2025';

  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC];
  scannedResult: string | null = 'null';
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;  // Fix: Use `undefined` instead of `null`
  currentDeviceIndex = 0;

  statusScanner = 'Escaneando QR Code...';

  progresso = 20;

  onCodeResult(result: string) {
    this.scannedResult = result;
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

  goBack() {

  }

}
