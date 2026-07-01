import { signal, Component, inject, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { Cliente, Producto } from '../../../../core/models/interfaces/inrferfaces';
import { FormsModule } from '@angular/forms';
import { EditarDatos } from '../editar-datos/editar-datos';
import { EditarProductos } from '../../../productos/editar-productos/editar-productos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [FormsModule, EditarDatos, EditarProductos],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css',
})
export class ListaClientes implements OnInit {
  private clienteService = inject(ClientesService);
  private toastr = inject(ToastrService)

  clientes = signal<Cliente[]>([]);
  clienteADetallar: Cliente | null = null;
  private router = inject(Router)

  ngOnInit(): void {
    this.obtenerClientes()
  }

  obtenerClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes.set(data);
        this.clientesFiltrados.set(data);
      },
      error: (e) => {
        console.error('Error al obtener los clientes: ', e);
      }
    })
  }

  verDetalle(cliente: Cliente) {
    this.clienteADetallar = cliente
  }

  clientesFiltrados = signal<Cliente[]>([]);

  buscarCliente(event: any) {
    const input = event.target as HTMLInputElement;
    const termino = input.value.toLowerCase();

    const resultados = this.clientes().filter(cliente => {
      const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
      const calle = cliente.calle?.toLowerCase() || '';

      return (
        nombreCompleto.includes(termino) || calle.includes(termino)
      )
    })

    this.clientesFiltrados.set(resultados)
  }

  clienteAEditar: Cliente | null = null;

  prepararEdicion(cliente: Cliente) {
    this.clienteAEditar = cliente;
  }

  agregarCliente() {
    this.router.navigate(['/registro'])
  }

  async eliminarCliente(id?: string) {
    if (!id) {
      this.toastr.error('Error al eliminar Cliente')
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Estas seguro?',
      text: 'Se borrará este cliente y todos sus envases. Esta accion no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Si, elimnar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      this.clienteService.deleteCliente(id).subscribe({
        next: (data) => {
          console.log('Cliente eliminado con exito: ', data);
          this.toastr.warning('Cliente eliminado con éxito');
          this.obtenerClientes()
        },
        error: (e) => {
          this.toastr.error('Ocurrio un problema al eliminar el cliente')
        }
      })
    }
  }

}
