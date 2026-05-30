import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ListTareaDTO } from './list-tarea-dto';
import { Template } from '../../../template/template';
import { GestionTarea } from '../gestion/gestion-tarea';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoApiClient } from './proyecto-api-client';
import { ProyectoDTO } from './proyecto-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tareas-listado',
  templateUrl: './tareas-listado.html',
  styleUrls: ['./tareas-listado.css'],
  imports: [Template, GestionTarea],
})
export class TareasListado implements OnInit {
  private readonly messageService = inject(MessageService);

  private readonly proyectoApiClient = inject(ProyectoApiClient);

  proyecto = signal<ProyectoDTO | null>(null);

  dialogVisible = signal(false);

  tareaSeleccionada = signal<ListTareaDTO | null>(null);

  private readonly router = inject(Router);

  readonly idProyecto = signal<number | null>(null);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refreshProyecto();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    this.idProyecto.set(Number(this.route.snapshot.paramMap.get('id')));

    if (!this.idProyecto()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Id de proyecto no válido.',
      });
      this.router.navigateByUrl('/proyectos');
    }
  }

  ngOnInit(): void {
    this.refreshProyecto();
  }

  refreshProyecto(): void {
    this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
      next: (data) => {
        this.proyecto.set(data);
      },
      error: (error: HttpErrorResponse) => {
        let detail = '';
        if (error.error.statusCode >= 400 && error.error.statusCode < 500) {
          detail = error.error.message;
        } else {
          detail = 'Ha ocurrido un error. Intente nuevamente más tarde.';
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
        this.router.navigateByUrl('/proyectos');
      },
    });
  }

  crearTarea(): void {
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.dialogVisible.set(true);
    this.tareaSeleccionada.set(tarea);
  }
}
