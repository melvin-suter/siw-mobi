import { Routes } from '@angular/router';
import { categoriesPath } from './category/category.routes';
import { expensesPath } from './expense/expense.routes';
import { authPath } from './auth/auth.routes';

export const defaultPath = categoriesPath;

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: defaultPath,
    pathMatch: 'full'
  },
  {
    path: categoriesPath,
    loadChildren: () => import('./category/category.routes')
  },
  {
    path: expensesPath,
    loadChildren: () => import('./expense/expense.routes')
  },
  {
    path: authPath,
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: '**',
    redirectTo: defaultPath
  }
];
export default appRoutes;
