import { Routes } from '@angular/router';
import { categoriesPath } from './category/category.routes';
import { expensesPath } from './expense/expense.routes';
import { authPath } from './auth/auth.routes';
import { authGuard } from './shared/guard/auth.guard';

export const defaultPath = categoriesPath;

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: defaultPath,
    pathMatch: 'full'
  },
  {
    path: categoriesPath,
    loadChildren: () => import('./category/category.routes'),
    canActivate: [authGuard],
  },
  {
    path: expensesPath,
    loadChildren: () => import('./expense/expense.routes'),
    canActivate: [authGuard],
  },
  {
    path: authPath,
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '**',
    redirectTo: defaultPath
  }
];
export default appRoutes;
