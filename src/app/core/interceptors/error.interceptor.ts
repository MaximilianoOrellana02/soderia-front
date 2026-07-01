import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../features/auth/services/auth.service";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastr = inject(ToastrService);
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let mensajeError = 'Ocurrio un error inesperado';

            switch (error.status) {
                case 400:
                    mensajeError = error.error?.message || 'Solicitud incorrecta';
                    break;
                case 401:
                    mensajeError = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
                    authService.cerrarSesion();
                    router.navigate(['/login']);
                    break;
                case 403:
                    mensajeError = 'No tienes permisos para realizar esta acción.';
                    break;
                case 404:
                    mensajeError = 'El recurso solicitado no fue encontrado.';
                    break;
                case 500:
                    mensajeError = 'Error interno del servidor. Inténtalo más tarde.';
                    break;
            }

            toastr.error(mensajeError, `Error ${error.status}`);

            return throwError(() => error)
        })
    )
}