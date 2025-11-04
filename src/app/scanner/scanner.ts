import { Component, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  imports: [ZXingScannerModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss',
})
export class Scanner {

  allowedFormats = [BarcodeFormat.QR_CODE]; //, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC];
  scannedResult: string | null = null;
  hasDevices = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;  // Fix: Use `undefined` instead of `null`
  currentDeviceIndex = 0;

  statusScanner = 'Escaneando QR Code...';

  onCodeResult(result: string) {
    this.scannedResult = result;
  }

  onDeviceSelectChange(event: Event) {
    console.log('onDeviceSelectChange');
    const target = event.target as HTMLSelectElement; // Fix: Properly typecast EventTarget
    this.selectedDevice = this.availableDevices.find(device => device.deviceId === target.value);
  }

  onHasDevices(hasDevices: boolean) {
    console.log('onHasDevices');
    this.hasDevices = hasDevices;
  }

  onDevicesFound(devices: MediaDeviceInfo[]) {
    console.log('onDevicesFound');
    console.log(devices);
    this.availableDevices = devices.filter(device => device.kind === 'videoinput');
    if (this.availableDevices.length > 0) {
      this.selectedDevice = this.availableDevices[0];
    }
  }

  onError(error: any) {
    console.error('Erro ao escanear:', error);
  }

  toggleCamera() {
    console.log('toggleCamera');
    if (this.availableDevices.length > 1) {
      this.currentDeviceIndex = (this.currentDeviceIndex + 1) % this.availableDevices.length;
      this.selectedDevice = this.availableDevices[this.currentDeviceIndex];
    }
  }





}
