import { Component, effect, inject, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UpdateClienteDto } from './update-cliente-dto';
import { EstadosClientesEnum } from '../estados-clientes-enum';
import { GestionClienteApiClient } from './gestion-cliente-api-client';
import { CreateClienteDTO } from './create-cliente-dto';
import { ListClienteDTO } from '../listado/list-cliente-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-cliente',
  templateUrl: './gestion-cliente.html',
  styleUrls: ['./gestion-cliente.css'],
  imports: [ReactiveFormsModule],
})
export class GestionCliente {
  visible = model(false);

  clienteSeleccionado = model<ListClienteDTO | null>(null);

  readonly estados = Object.values(EstadosClientesEnum);

  private readonly messageService = inject(MessageService);

  private readonly gestionClienteApiClient = inject(GestionClienteApiClient);

  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl(EstadosClientesEnum.ACTIVO, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const clienteSeleccionado = this.clienteSeleccionado();
      if (clienteSeleccionado) {
        this.form.patchValue({
          nombre: clienteSeleccionado.nombre,
          estado: clienteSeleccionado.estado,
        });
      } else {
        this.form.reset({
          nombre: '',
          estado: EstadosClientesEnum.ACTIVO,
        });
      }
    });
  }

  cerrarDialog(): void {
    this.clienteSeleccionado.set(null);
    this.visible.set(false);
  }

  guardarCliente(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.',
      });
      return;
    }

    const formRawValue = this.form.getRawValue();

    const clienteSeleccionado = this.clienteSeleccionado();
    if (clienteSeleccionado) {
      const dto: UpdateClienteDto = {
        nombre: formRawValue.nombre,
        estado: formRawValue.estado,
      };
      this.gestionClienteApiClient.actualizarCliente(clienteSeleccionado.id, dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente.',
          });
          this.cerrarDialog();
        },
        error: (error: HttpErrorResponse) => {
          let detail = '';
          if (error.error.statusCode >= 400 && error.error.statusCode < 500) {
            detail = error.error.message;
          } else {
            detail = 'Ha ocurrido un error. Intente nuevamente más tarde.';
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
        },
      });
    } else {
      const dto: CreateClienteDTO = {
        nombre: formRawValue.nombre,
      };
      this.gestionClienteApiClient.crearCliente(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente.',
          });
          this.cerrarDialog();
        },
        error: (error: HttpErrorResponse) => {
          let detail = '';
          if (error.error.statusCode >= 400 && error.error.statusCode < 500) {
            detail = error.error.message;
          } else {
            detail = 'Ha ocurrido un error. Intente nuevamente más tarde.';
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
        },
      });
    }
  }
}
