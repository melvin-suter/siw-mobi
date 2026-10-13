import { Routes } from '@angular/router';

export const authPath = 'auth';

const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component'),
    title: 'Categories'
  }
];

export default authRoutes;
