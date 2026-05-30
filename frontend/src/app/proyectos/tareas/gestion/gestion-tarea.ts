import { Component, effect, inject, input, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GestionTareaApiClient } from './gestion-tarea-api-client';
import { ListTareaDTO } from '../listado/list-tarea-dto';
import { EstadosTareasEnum } from '../estados-tareas-enum';
import { UpdateTareaDto } from './update-tarea-dto';
import { CreateTareaDTO } from './create-tarea-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-tarea',
  templateUrl: './gestion-tarea.html',
  styleUrls: ['./gestion-tarea.css'],
  imports: [ReactiveFormsModule],
})
export class GestionTarea {
  visible = model(false);

  tareaSeleccionada = model<ListTareaDTO | null>(null);

  readonly estados = Object.values(EstadosTareasEnum);

  private readonly messageService = inject(MessageService);

  private readonly gestionTareaApiClient = inject(GestionTareaApiClient);

  readonly idProyecto = input<number | null>(null);

  readonly form = new FormGroup({
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    estado: new FormControl(EstadosTareasEnum.PENDIENTE, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const tareaSeleccionada = this.tareaSeleccionada();
      if (tareaSeleccionada) {
        this.form.patchValue({
          descripcion: tareaSeleccionada.descripcion,
          estado: tareaSeleccionada.estado,
        });
      } else {
        this.form.reset({
          descripcion: '',
          estado: EstadosTareasEnum.PENDIENTE,
        });
      }
    });
  }

  cerrarDialog(): void {
    this.tareaSeleccionada.set(null);
    this.visible.set(false);
  }

  guardarTarea(): void {
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

    const tareaSeleccionada = this.tareaSeleccionada();
    if (tareaSeleccionada) {
      const dto: UpdateTareaDto = {
        descripcion: formRawValue.descripcion,
        estado: formRawValue.estado,
      };
      this.gestionTareaApiClient
        .actualizarTarea(this.idProyecto(), tareaSeleccionada.id, dto)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Tarea actualizada correctamente.',
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
      const dto: CreateTareaDTO = {
        descripcion: formRawValue.descripcion,
      };
      this.gestionTareaApiClient.crearTarea(this.idProyecto(), dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tarea creada correctamente.',
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
