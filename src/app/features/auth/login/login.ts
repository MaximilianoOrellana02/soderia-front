import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef)
  private toastr = inject(ToastrService)


  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  ingresar() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          const token = response.token || response.accessToken || response.data?.token;
          const username = response.username || response.user?.username || response.data?.username;

          if (!token) {
            console.error('El servidor no devolvió un token. Respuesta completa:', response);
            this.toastr.error('El servidor no retornó un token válido', 'Error de autenticación');
            return;
          }

          this.toastr.success('Bienvenido al sistema', 'Acceso correcto')
          this.authService.guardaToken(token);
          this.authService.guardarUsuario(username || 'Usuario');
          this.router.navigate(['/']);
        },
        error: (e) => {

          const mensajeError = e.error?.msg || 'Ocurrio un error inesperado';
          this.cdr.detectChanges()

          this.toastr.error(mensajeError, 'Error de autenticación')
        }
      })
  }
}
