import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Producto } from '../../../core/models/interfaces/inrferfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ProductoService {
    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/productos`

    asignarProducto(data: { cliente_id: string, tipoProducto: string, cantidad: number }) {
        return this.http.post(`${this.url}`, data)
    }

    updateEnvases(producto: Producto): Observable<Producto> {
        return this.http.put<Producto>(`${this.url}/${producto.id}`, { cantidad: producto.cantidad });
    }
}