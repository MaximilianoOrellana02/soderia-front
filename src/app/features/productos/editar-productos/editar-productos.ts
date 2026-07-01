import { Component, inject, Input, input } from '@angular/core';
import { Cliente } from '../../../core/models/interfaces/inrferfaces';
import { ProductoService } from '../../clientes/services/producto.service';

@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [],
  templateUrl: './editar-productos.html',
  styleUrl: './editar-productos.css',
})
export class EditarProductos {
  @Input() cliente: Cliente | null = null;
  private productoService = inject(ProductoService)

  ajustar(producto: any, delta: number) {
    const nueva = producto.cantidad + delta;
    if (nueva < 0) return;

    const original = producto.cantidad;
    producto.cantidad = nueva;

    this.productoService.updateEnvases(producto).subscribe({
      error: () => {
        producto.cantidad = original;
        console.error('Error al actualizar');
      }
    })
  }
}
