import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ListaClientes } from './features/clientes/components/lista-clientes/lista-clientes';
import { NavBar } from "./shared/components/nav-bar/nav-bar";
import { every, filter } from 'rxjs';
import { Spinner } from "./shared/components/spinner/spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('nuevo-front');
  mostrarNavBar = true;
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.mostrarNavBar = event.url !== '/login'
    })
  }
}
