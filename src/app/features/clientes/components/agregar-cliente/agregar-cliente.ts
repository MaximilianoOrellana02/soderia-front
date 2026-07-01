import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agregar-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './agregar-cliente.html',
  styleUrl: './agregar-cliente.css',
})
export class AgregarCliente {
  private clienteService = inject(ClientesService)
  private router = inject(Router);
  private toastr = inject(ToastrService)


  clienteForm = new FormGroup({
    datos: new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      nro_telefono: new FormControl(''),
      calle: new FormControl('', Validators.required),
      altura: new FormControl('', Validators.required),
      piso_depto: new FormControl(''),
      barrio: new FormControl(''),
      localidad: new FormControl(''),
    }),
    // En tu definición de clienteForm
    envases: new FormGroup({
      agua20L: new FormControl(0),     // Nombre limpio
      agua12L: new FormControl(0),
      soda15L: new FormControl(0),     // Nombre limpio (sin punto ni espacio)
      soda125L: new FormControl(0),// Sin puntos
      soda1L: new FormControl(0),
      soda650cc: new FormControl(0),
      dispenserFC: new FormControl(0),
      dispenserA: new FormControl(0),
    }),
  });

  async guardarCliente() {
    if (this.clienteForm.invalid) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    try {
      const datosCliente = this.clienteForm.value.datos as any;
      const response: any = await firstValueFrom(this.clienteService.crearCliente(datosCliente));
      const nuevoId = response.cliente.id;

      const mapaEnvases: Record<string, string> = {
        agua20L: 'Agua 20L',
        agua12L: 'Agua 12L',
        soda15L: 'Soda 1.5L',
        soda125L: 'Soda 1.25L',
        soda1L: 'Soda 1L',
        soda650cc: 'Soda 650cc',
        dispenserFC: 'Dispenser Frío/Calor',
        dispenserA: 'Dispenser Ambiental'
      };

      const envasesForm = this.clienteForm.value.envases as any;

      for (const [key, cantidad] of Object.entries(envasesForm)) {
        if (typeof cantidad === 'number' && cantidad > 0) {
          // Obtenemos el nombre real usando el mapa
          const tipoProductoReal = mapaEnvases[key];

          const nuevoProducto = {
            cliente_id: nuevoId,
            tipoProducto: tipoProductoReal,
            cantidad: cantidad,
          };
          await firstValueFrom(this.clienteService.asignarProducto(nuevoProducto));
        }
      }
      this.router.navigate(['/']);
      this.toastr.success('Cliente registrado con exito')
    } catch (error) {
      console.error('Error: ', error);
      this.toastr.error('Error al registrar cliente')
    }
  }
}
