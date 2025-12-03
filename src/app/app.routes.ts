import { Routes } from '@angular/router';
import { App } from './app';
import { AuthGuardADM } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: App,
        children: [
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

        ]
    },
    { path: '**', redirectTo: '/' }
];
