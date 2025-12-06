import { Routes } from '@angular/router';
import { App } from './app';
import { AuthGuardADM, AuthGuardUser } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./home/home').then(c => c.Home),
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./perfil/perfil').then(c => c.Perfil),
    },
    {
        path: 'evento/:id',
        loadComponent: () =>
            import('./eventos/detalhes-evento/detalhes-evento').then(c => c.DetalhesEvento),
    },
    {
        path: 'tickets',
        loadComponent: () =>
            import('./tickets/tickets').then(c => c.Tickets),
    },
    {
        path: 'hostess',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./hostess/hostess').then(c => c.Hostess),
    },
    {
        path: 'scanner/:id',
        loadComponent: () =>
            import('./hostess/scanner/scanner').then(c => c.Scanner),
    },
    {
        path: 'qrcode-generator',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./qrcode/qrcode').then(c => c.Qrcode),
    },
    {
        path: 'checkout',
        canActivate: [AuthGuardUser],
        loadComponent: () =>
            import('./checkout/checkout').then(c => c.Checkout),
    },
    {
        path: 'politica-privacidade',
        loadComponent: () =>
            import('./politica-privacidade/politica-privacidade').then(c => c.PoliticaPrivacidade),
    },
    {
        path: 'exclusao-dados',
        loadComponent: () =>
            import('./exclusao-dados/exclusao-dados').then(c => c.ExclusaoDados),
    },
    {
        path: 'termos-servico',
        loadComponent: () =>
            import('./termos-servico/termos-servico').then(c => c.TermosServico),
    },
    {
        path: 'sobre-nos',
        loadComponent: () =>
            import('./sobre-nos/sobre-nos').then(c => c.SobreNos),
    },
    {
        path: 'pedidos-compra',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./admin/pedidos-compra/pedidos-compra').then(c => c.PedidosCompraComponent),
    },
    {
        path: 'pedidos-compra/detalhes',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./admin/pedidos-compra/detalhes-pedido-compra/detalhes-pedido-compra').then(c => c.DetalhesPedidoCompraComponent),
    },
    {
        path: 'tickets-admin',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./hostess/tickets-admin/tickets-admin').then(c => c.TicketsAdminComponent),
    },
    {
        path: 'tickets-admin/detalhes',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./hostess/tickets-admin/detalhes-ticket').then(c => c.DetalhesTicketComponent),
    },
    {
        path: 'dashboard-vendas',
        canActivate: [AuthGuardADM],
        loadComponent: () =>
            import('./admin/dashboard-vendas/dashboard-vendas.component').then(c => c.DashboardVendasComponent),
    },
    { path: '**', redirectTo: '/' }
];
