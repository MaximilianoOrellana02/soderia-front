import { Routes } from '@angular/router';
import { ListaClientes } from './features/clientes/components/lista-clientes/lista-clientes';
import { AgregarCliente } from './features/clientes/components/agregar-cliente/agregar-cliente';
import { authGuard } from './features/auth/guards/auth.guard';
import { publicGuard } from './features/auth/guards/public.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login), canActivate: [publicGuard] },
    { path: '', component: ListaClientes, canActivate: [authGuard] },
    { path: 'registro', component: AgregarCliente, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
