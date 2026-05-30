import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientesListadoApiClient } from './clientes-listado-api-client';
import { ListClienteDTO } from './list-cliente-dto';
import { GestionCliente } from '../gestion/gestion-cliente';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clientes-listado',
  templateUrl: './clientes-listado.html',
  styleUrls: ['./clientes-listado.css'],
  imports: [GestionCliente],
})
export class ClientesListado implements OnInit {
  private readonly messageService = inject(MessageService);

  visible = model(false);

  private readonly clientesListadoApiClient = inject(ClientesListadoApiClient);

  clientes = signal<ListClienteDTO[]>([]);

  dialogVisible = signal(false);

  clienteSeleccionado = signal<ListClienteDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
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

  crearCliente(): void {
    this.dialogVisible.set(true);
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.dialogVisible.set(true);
    this.clienteSeleccionado.set(cliente);
  }

  cerrarModal(): void {
    this.visible.set(false);
  }
}
