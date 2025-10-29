import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instalacao',
  imports: [],
  templateUrl: './instalacao.html',
  styleUrl: './instalacao.scss',
})
export class Instalacao implements OnInit {

  showInstallBanner = false;
  deferredPrompt: any;

  constructor() { }

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner = true;
    });

    setTimeout(() => {
      this.closeBanner();
    }, 10000);
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        // if (choiceResult.outcome === 'accepted') {
        //   console.log('Usuário aceitou instalar');
        // } else {
        //   console.log('Usuário recusou instalar');
        // }
        this.deferredPrompt = null;
        this.showInstallBanner = false;
      });
    }
  }

  closeBanner(): void {
    this.showInstallBanner = false;
  }

}
