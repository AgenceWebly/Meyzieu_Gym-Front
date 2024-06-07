import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { authGuard } from './shared/guards/auth.guard';
import { MembersComponent } from './pages/members/members.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AddMemberComponent } from './pages/add-member/add-member.component';
import { SeasonsComponent } from './pages/admin/season/seasons/seasons.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { CreateSeasonComponent } from './pages/admin/season/create-season/create-season.component';

export const routes: Routes = [
  {
    path: 'accueil',
    component: HomeComponent,
  },
  {
    path: 'profil/edit',
    component: EditProfileComponent,
    canActivate: [authGuard],
    data: {
      userType: 'user',
    },
  },
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [authGuard],
    data: {
      userType: 'user',
    },
  },

  {
    path: 'adherents',
    component: MembersComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'entrainements',
    component: HomeComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'competitions',
    component: HomeComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription',
    component: RegistrationComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription',
    component: RegistrationComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/nouvel-adherent',
    component: AddMemberComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/cours',
    component: RegistrationComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/questionnaire-medical',
    component: RegistrationComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'contact',
    component: HomeComponent,
  },
  {
    path: 'options',
    component: HomeComponent,
    canActivate: [authGuard],
    data: {
      userType: 'user',
    },
  },
  {
    path: 'deconnexion',
    component: LogoutComponent,
    canActivate: [authGuard],
    data: {
      userType: 'user',
    },
  },
  {
    path: 'creation-compte',
    component: SignUpComponent,
    canActivate: [authGuard],
    data: {
      userType: 'visitorOnly',
    },
  },
  {
    path: 'connexion',
    component: LoginComponent,
    canActivate: [authGuard],
    data: {
      userType: 'visitorOnly',
    },
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/saisons/nouvelle-saison',
    component: CreateSeasonComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/saisons',
    component: SeasonsComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
];
