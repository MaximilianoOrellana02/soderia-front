import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    private myAppUrl = environment.apiUrl;

    isLoggedIn = signal<boolean>(!!this.obtenerToken());

    login(credenciales: any): Observable<any> {
        return this.http.post<any>(`${this.myAppUrl}/auth/login`, credenciales);
    }

    guardaToken(token: string) {
        if (!token || token === 'undefined') {
            this.cerrarSesion();
            return;
        }
        localStorage.setItem('token', token);
        this.isLoggedIn.set(true);
    }

    cerrarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.isLoggedIn.set(false);
    }

    obtenerToken() {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            return null;
        }
        return token;
    }

    guardarUsuario(nombre: string) {
        localStorage.setItem('username', nombre);
    }

    obtenerUsuario() {
        return localStorage.getItem('username') || 'Username'
    }


}