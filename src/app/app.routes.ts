import { Routes } from '@angular/router';
import { App } from './app';

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
                path: 'evento/:id',
                loadComponent: () =>
                    import('./eventos/detalhes-evento/detalhes-evento').then(c => c.DetalhesEvento),
            },
            {
                path: 'hostess',
                loadComponent: () =>
                    import('./hostess/hostess').then(c => c.Hostess),
            },
            {
                path: 'scanner/:id',
                loadComponent: () =>
                    import('./hostess/scanner/scanner').then(c => c.Scanner),
            }

        ]
    }
];
