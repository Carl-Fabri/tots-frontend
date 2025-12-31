import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/spaces-list/spaces-list.component').then(m => m.SpacesListComponent)
      },
      {
        path: 'spaces/:id',
        loadComponent: () => import('./components/space-detail/space-detail.component').then(m => m.SpaceDetailComponent)
      },
      {
        path: 'spaces/:id/reserve',
        loadComponent: () => import('./components/reservation-form/reservation-form.component').then(m => m.ReservationFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'reservations',
        loadComponent: () => import('./components/reservations-list/reservations-list.component').then(m => m.ReservationsListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'admin/spaces',
        loadComponent: () => import('./components/admin-spaces/admin-spaces.component').then(m => m.AdminSpacesComponent),
        canActivate: [authGuard, adminGuard]
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
