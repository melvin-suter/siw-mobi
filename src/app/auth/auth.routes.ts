import { Routes } from '@angular/router';

export const authPath = 'auth';
export const loginPath = 'auth/login';

const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'Login'
  }
];

export default authRoutes;
