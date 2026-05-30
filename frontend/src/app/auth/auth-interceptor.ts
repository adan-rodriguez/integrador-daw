import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthStore } from './auth-store';
import { catchError, EMPTY, throwError } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authStore = inject(AuthStore);
  const authToken = authStore.obtenerToken();

  let reqClone;
  if (!authToken) {
    reqClone = req;
  } else {
    reqClone = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
  }

  return next(reqClone).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const esPeticionDeLogin = req.url.includes('/api/v1/auth');
        if (esPeticionDeLogin) {
          return throwError(() => error);
        } else {
          authStore.cerrarSesion();
          return EMPTY;
        }
      }
      return throwError(() => error);
    }),
  );
}
