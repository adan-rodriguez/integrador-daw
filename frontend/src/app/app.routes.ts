import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: Login,
  },
  {
    path: 'proyectos',
    title: 'Proyectos',
    component: ProyectosListado,
    canActivate: [authGuard],
  },
  {
    path: 'proyectos/:id/tareas',
    title: 'Tareas',
    component: TareasListado,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
