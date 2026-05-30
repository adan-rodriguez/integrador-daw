import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ListProyectoDTO } from './list-proyecto-dto';
import { ProyectosListadoApiClient } from './proyectos-listado-api-client';
import { Template } from '../../template/template';
import { GestionProyecto } from '../gestion/gestion-proyecto';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-proyectos-listado',
  templateUrl: './proyectos-listado.html',
  styleUrls: ['./proyectos-listado.css'],
  imports: [Template, GestionProyecto, RouterLink],
})
export class ProyectosListado implements OnInit {
  private readonly messageService = inject(MessageService);

  private readonly proyectosListadoApiClient = inject(ProyectosListadoApiClient);

  proyectos = signal<ListProyectoDTO[]>([]);

  dialogVisible = signal(false);

  proyectoSeleccionado = signal<ListProyectoDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarProyectos();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error. Intente nuevamente más tarde.',
        });
      },
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }
}
