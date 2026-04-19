import { Routes } from '@angular/router';

// dashboard page
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // redirect root to login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // login page
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },

  // dashboard page
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  // bid detail page
  {
    path: 'bid-detail',
    loadComponent: () =>
      import('./pages/bid-detail/bid-detail.component')
        .then(m => m.BidDetailComponent)
  },

  // fallback to login
  {
    path: '**',
    redirectTo: 'login'
  }
];
