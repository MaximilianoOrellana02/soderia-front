import { Component, inject, signal } from '@angular/core';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
    this.toastr.success('Sesion cerrada', 'Hasta la proxima') // Redirige al login instantáneamente
  }

  get nombreUsuario(): string {
    return this.authService.obtenerUsuario()
  }
}
