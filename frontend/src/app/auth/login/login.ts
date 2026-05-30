import { Component, inject } from '@angular/core';
import { LoginApiClient } from './login-api-client';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../auth-store';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ReactiveFormsModule],
})
export class Login {
  private readonly loginApiClient = inject(LoginApiClient);

  private readonly messageService = inject(MessageService);

  private readonly authStore = inject(AuthStore);

  private readonly router = inject(Router);

  readonly loginForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    clave: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  iniciarSesion() {
    const loginForm = this.loginForm;
    if (!loginForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Los campos del formulario son requeridos.',
      });
      return;
    }

    const { nombre, clave } = loginForm.getRawValue();

    this.loginApiClient.iniciarSesion(nombre, clave).subscribe({
      next: (data) => {
        this.authStore.guardarToken(data.accessToken);
        this.router.navigateByUrl('/proyectos');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario o clave incorrectos.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error. Intenta nuevamente mas tarde.',
          });
        }
      },
    });
  }
}
