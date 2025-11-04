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
                    import('./home/home').then(m => m.Home),
            },
            {
                path: 'hostess',
                loadComponent: () =>
                    import('./hostess/hostess').then(m => m.Hostess),
            },
            {
                path: 'scanner',
                loadComponent: () =>
                    import('./scanner/scanner').then(m => m.Scanner),
            }

        ]
    }
];
