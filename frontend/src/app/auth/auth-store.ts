import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly router = inject(Router);

  obtenerToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  guardarToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  private removerToken(): void {
    sessionStorage.removeItem('accessToken');
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();

    if (!token) {
      return false;
    }

    if (this.tokenExpirado(token)) {
      this.removerToken();
      return false;
    }

    return true;
  }

  cerrarSesion(): void {
    this.removerToken();
    this.router.navigateByUrl('/login');
  }

  private tokenExpirado(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      const payload = JSON.parse(jsonPayload);

      if (!payload.exp) {
        return false;
      }

      const expirationDate = payload.exp * 1000;
      const isExpired = Date.now() > expirationDate;

      return isExpired;
    } catch (error) {
      return true;
    }
  }
}
