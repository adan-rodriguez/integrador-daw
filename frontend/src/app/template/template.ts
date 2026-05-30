import { Component, inject } from '@angular/core';
import { AuthStore } from '../auth/auth-store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.html',
  styleUrl: './template.css',
  imports: [RouterLink],
})
export class Template {
  private readonly authStore = inject(AuthStore);

  cerrarSesion(): void {
    this.authStore.cerrarSesion();
  }
}
