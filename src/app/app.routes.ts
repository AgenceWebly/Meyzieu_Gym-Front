import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilComponent } from './pages/profil/profil.component';

export const routes: Routes = [
  {
    path: 'accueil',
    component: HomeComponent,
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'adherents',
    component: HomeComponent,
  },
  {
    path: 'entrainements',
    component: HomeComponent,
  },
  {
    path: 'competitions',
    component: HomeComponent,
  },
  {
    path: 'inscription',
    component: HomeComponent,
  },
  {
    path: 'contact',
    component: HomeComponent,
  },
  {
    path: 'options',
    component: HomeComponent,
  },
  {
    path: 'deconnexion',
    component: HomeComponent,
  },
  {
    path: 'creation-compte',
    component: SignUpComponent,
  },
  {
    path: 'connexion',
    component: LoginComponent,
  },
];
