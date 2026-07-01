import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Cliente, Producto } from '../../../core/models/interfaces/inrferfaces';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private myAppUrl = environment.apiUrl;
    private myApiUrl = '/clientes/';

    private http = inject(HttpClient);

    getClientes(): Observable<Cliente[]> {
        return this.http.get<{ clientes: Cliente[] }>(`${this.myAppUrl}${this.myApiUrl}`)
            .pipe(
                map(response => response.clientes)
            )
    }

    actualizarCliente(id: string, datosEditados: any): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.myAppUrl}${this.myApiUrl}${id}`, datosEditados)
    }

    crearCliente(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(`${this.myAppUrl}${this.myApiUrl}`, cliente)
    }

    asignarProducto(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(`${this.myAppUrl}/productos/`, producto)
    }

    deleteCliente(id: string): Observable<any> {
        return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}${id}`)
    }
}
