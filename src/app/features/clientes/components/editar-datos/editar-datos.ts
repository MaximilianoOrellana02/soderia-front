import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../../core/models/interfaces/inrferfaces';
import { ClientesService } from '../../services/clientes.service';
import { firstValueFrom } from 'rxjs';
import id from '@angular/common/locales/id';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-datos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-datos.html',
  styleUrl: './editar-datos.css',
})
export class EditarDatos implements OnChanges {
  @Input() cliente: Cliente | null = null;

  @Output() cambiosGuerdados = new EventEmitter<void>()
  private clienteService = inject(ClientesService)
  private cd = inject(ChangeDetectorRef)
  private toastr = inject(ToastrService)

  editarForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    nro_telefono: new FormControl(''),
    calle: new FormControl('', Validators.required),
    altura: new FormControl('', Validators.required),
    piso_depto: new FormControl(''),
    barrio: new FormControl(''),
    localidad: new FormControl(''),
  });

  ngOnChanges() {
    if (this.cliente) {
      this.editarForm.patchValue({
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        nro_telefono: this.cliente.nro_telefono || '',
        calle: this.cliente.calle,
        altura: this.cliente.altura,
        piso_depto: this.cliente.piso_depto || '',
        barrio: this.cliente.barrio,
        localidad: this.cliente.localidad
      });
    }
  }

  async guardar() {
    if (this.editarForm.invalid || !this.cliente?.id) {
      alert('Revisa los campos obligatorios')
      return;
    }

    try {

      const idCliente = this.cliente.id;
      const datosEditados = this.editarForm.value as any;


      await firstValueFrom(this.clienteService.actualizarCliente(idCliente, datosEditados));
      this.cambiosGuerdados.emit();
      this.cd.detectChanges()
      this.toastr.success('Cliente actualizado con éxitos')
    } catch (error) {
      this.toastr.error('Ocurrió un error al actualizar el cliente.')
    }
  }
}
