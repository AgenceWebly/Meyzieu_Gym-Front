import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'accueil',
    component: HomeComponent
  },
  {
    path: 'profil',
    component: HomeComponent
  },
  {
    path: 'adherents',
    component: HomeComponent
  },
  {
    path: 'entrainements',
    component: HomeComponent
  },
  {
    path: 'competitions',
    component: HomeComponent
  },
  {
    path: 'inscription',
    component: HomeComponent
  },
  {
    path: 'contact',
    component: HomeComponent
  },
  {
    path: 'options',
    component: HomeComponent
  },
  {
    path: 'deconnexion',
    component: HomeComponent
  }
];
