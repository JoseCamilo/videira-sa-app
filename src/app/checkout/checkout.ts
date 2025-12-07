import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CurrencyFormatPipe } from "../pipes/currency.pipe";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Loading } from "../loading/loading";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { AnalyticsService } from '../services/analytics.service';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export interface ProdutoPedido {
  id: string,
  titulo: string,
  descricao: string,
  imagem: string,
  quantidade: number,
  precoUnitario: number,
  tipo: string,
  categoria: string,
  evento?: string
}

export interface Pedido {
  produtos: ProdutoPedido[];
  valorTotal?: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CurrencyFormatPipe, Loading],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit, AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(Router);
  private location = inject(Location);

  pedido: Pedido = {
    produtos: [],
    valorTotal: 0
  };
  statusScreen: boolean = false;
  nome: string = '';
  email: string = '';
  igreja: string = '';
  funcao: string = '';
  pastor: string = '';


  authService = inject(AuthService);
  loading: boolean = true;
  isApproved: boolean = false;
  isPending: boolean = false;
  paymentBrickReady: boolean = false;
  analyticsService = inject(AnalyticsService);

  ngOnInit() {
    const navigation = history.state;
    if (navigation?.produtos) {
      this.pedido.produtos = navigation.produtos;
    }

    this.authService.login$.subscribe(l => {
      this.nome = l.nome;
      this.email = l.email;
      this.igreja = l.igreja;
      this.funcao = l.funcao;
      this.pastor = l.pastor;
      this.onRenderedPaymentBrick();
    });

    this.nome = this.authService.getNome();
    this.email = this.authService.getEmail();
    this.igreja = this.authService.getIgreja();
    this.funcao = this.authService.getFuncao();
    this.pastor = this.authService.getPastor();

    this.pedido.valorTotal = Math.round(this.pedido.produtos.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0) * 100) / 100;
  }

  ngAfterViewInit() {
    this.onRenderedPaymentBrick();
  }

  ngOnDestroy() {
    if ((window as any).paymentBrickController) {
      (window as any).paymentBrickController.unmount();
    }
    if ((window as any).statusScreenBrickController) {
      (window as any).statusScreenBrickController.unmount();
    }
  }

  onRenderedPaymentBrick() {
    if (!this.paymentBrickReady && this.nome && this.email && this.igreja && this.funcao && this.pastor) {
      this.renderPaymentBrick();
      this.paymentBrickReady = true;
    }
  }

  renderPaymentBrick = async () => {
    await loadMercadoPago();
    const mp = new window.MercadoPago(environment.mpPublicKey);

    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: {
        amount: this.pedido.valorTotal || 0,
        payer: {
          firstName: this.nome.split(' ')[0] || '',
          lastName: this.nome.split(' ').slice(1).join(' ') || '',
          email: this.email || '',
        }
      },
      customization: {
        paymentMethods: {
          creditCard: "all",
          ticket: "all",
          bankTransfer: "all",
          maxInstallments: 1
        },
        visual: {
          hideFormTitle: true
        }
      },
      callbacks: {
        onReady: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
        onSubmit: ({ selectedPaymentMethod, formData }: any) => {
          formData = {
            ...formData,
            description: this.pedido.produtos[0].titulo,
            statement_descriptor: 'IGREJAVIDEIRA',
            callback_url: 'https://videiraabc.com.br/tickets',
            additional_info: {
              ip_address: '',
              items: this.pedido.produtos.map(item => ({
                id: item.id,
                title: item.titulo,
                description: item.descricao,
                picture_url: item.imagem,
                category_id: `${item.categoria}`,
                quantity: item.quantidade,
                unit_price: item.precoUnitario,
                type: item.tipo,
                evento: item.evento || ''
              })),
              payer: {
                first_name: this.nome.split(' ')[0] || '',
                last_name: this.nome.split(' ').slice(1).join(' ') || '',
                authentication_type: 'Gmail',
                custom: {
                  email: this.email || '',
                  igreja: this.igreja || '',
                  funcao: this.funcao || '',
                  pastor: this.pastor || ''
                }
              }
            }
          };

          return new Promise((resolve, reject) => {
            fetch(`${environment.urlBackendAPI}/process_payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then((response) => {
                const paymentId = response.id;
                const tdsResource = response.three_ds_info?.external_resource_url || '';
                const creq = response.three_ds_info?.creq || '';
                this.loadStatusScreen(paymentId, tdsResource, creq);
                this.analyticsService.logTicketPurchase(this.pedido.valorTotal || 0, this.pedido.produtos[0].titulo);
                resolve({});
              })
              .catch((error) => {
                console.error(error);
                reject();
              });
          });
        },
        onError: (error: any) => {
          console.error(error);
        },
      },
    };

    (window as any).paymentBrickController = await bricksBuilder.create(
      "payment",
      "paymentBrick_container",
      settings
    );
  };

  loadStatusScreen = async (paymentId: string, externalResourceURL: string, creq: string) => {
    (window as any).paymentBrickController.unmount();
    this.statusScreen = true;
    this.loading = true;
    this.cdr.detectChanges();
    window.scrollTo(0, 0);

    await loadMercadoPago();
    const mp = new window.MercadoPago(environment.mpPublicKey);
    const bricksBuilder = mp.bricks();

    const renderStatusScreenBrick = async () => {
      const settings = {
        initialization: {
          paymentId: paymentId,
          additionalInfo: {
            externalResourceURL: externalResourceURL,
            creq: creq,
          },
        },
        callbacks: {
          onReady: () => {
            this.loading = false;
            this.cdr.detectChanges();
          },
          onError: (error: any) => {
            console.error('Status screen error:', error);
          },
        },
      };

      (window as any).statusScreenBrickController = await bricksBuilder.create(
        'statusScreen',
        'statusScreenBrick_container',
        settings,
      );

      setTimeout(() => {
        if ((window as any).statusScreenBrickController?.target?.innerText?.toLowerCase().includes('seu pagamento foi aprovado')) {
          this.isApproved = true;
          this.cdr.detectChanges();
        }
        if ((window as any).statusScreenBrickController?.target?.innerText?.toLowerCase().includes('via pix') ||
          (window as any).statusScreenBrickController?.target?.innerText?.toLowerCase().includes('via boleto')) {
          this.isPending = true;
          this.cdr.detectChanges();
        }
      }, 1000);
    };

    renderStatusScreenBrick();
  };

  goBack() {
    if (this.statusScreen) {
      this.route.navigate(['/']);
    } else {
      this.location.back();
    }
  }

  goMeusTickets() {
    this.route.navigate(['/tickets']);
  }
}
