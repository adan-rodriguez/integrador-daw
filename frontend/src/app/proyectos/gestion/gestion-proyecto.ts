import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadosProyectosEnum } from '../estados-proyectos-enum';
import { ListProyectoDTO } from '../listado/list-proyecto-dto';
import { MessageService } from 'primeng/api';
import { GestionProyectoApiClient } from './gestion-proyecto-api-client';
import { CreateProyectoDTO } from './create-proyecto-dto';
import { UpdateProyectoDto } from './update-proyecto-dto';
import { ListClienteDTO } from '../clientes/listado/list-cliente-dto';
import { ClientesListadoApiClient } from '../clientes/listado/clientes-listado-api-client';
import { ClientesListado } from '../clientes/listado/clientes-listado';
import { EstadosClientesEnum } from '../clientes/estados-clientes-enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-proyecto',
  templateUrl: './gestion-proyecto.html',
  styleUrls: ['./gestion-proyecto.css'],
  imports: [ReactiveFormsModule, ClientesListado],
})
export class GestionProyecto implements OnInit {
  visible = model(false);

  proyectoSeleccionado = model<ListProyectoDTO | null>(null);

  readonly dialogClientesVisible = signal(false);

  readonly estados = Object.values(EstadosProyectosEnum);

  private readonly messageService = inject(MessageService);

  private readonly gestionProyectoApiClient = inject(GestionProyectoApiClient);

  clientes = signal<ListClienteDTO[]>([]);

  private readonly clientesListadoApiClient = inject(ClientesListadoApiClient);

  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cliente: new FormControl<number | null>(null),
    estado: new FormControl(EstadosProyectosEnum.ACTIVO, {}),
  });

  constructor() {
    effect(() => {
      const proyectoSeleccionado = this.proyectoSeleccionado();
      if (proyectoSeleccionado) {
        this.form.patchValue({
          nombre: proyectoSeleccionado.nombre,
          cliente: proyectoSeleccionado.cliente?.id,
          estado: proyectoSeleccionado.estado,
        });
      } else {
        this.form.reset({
          nombre: '',
          cliente: null,
          estado: EstadosProyectosEnum.ACTIVO,
        });
      }
    });

    effect(() => {
      if (!this.dialogClientesVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes(EstadosClientesEnum.ACTIVO).subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los clientes.',
        });
      },
    });
  }

  cerrarDialog(): void {
    this.proyectoSeleccionado.set(null);
    this.visible.set(false);
  }

  guardarProyecto(): void {
    const form = this.form;
    if (!form.valid) {
      form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.',
      });
      return;
    }

    const formRawValue = form.getRawValue();

    const proyectoSeleccionado = this.proyectoSeleccionado();
    if (proyectoSeleccionado) {
      const dto: UpdateProyectoDto = {
        nombre: formRawValue.nombre,
        idCliente: Number(formRawValue.cliente) ?? null,
        estado: formRawValue.estado,
      };
      this.gestionProyectoApiClient.actualizarProyecto(proyectoSeleccionado.id, dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proyecto actualizado correctamente.',
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
      const dto: CreateProyectoDTO = {
        nombre: formRawValue.nombre,
        idCliente: Number(formRawValue.cliente) ?? null,
      };

      this.gestionProyectoApiClient.crearProyecto(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proyecto creado correctamente.',
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

  gestionarClientes(): void {
    this.dialogClientesVisible.set(true);
  }
}
