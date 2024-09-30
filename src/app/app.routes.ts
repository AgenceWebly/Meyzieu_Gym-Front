import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { authGuard } from './shared/guards/auth.guard';
import { AddMemberComponent } from './pages/registration/add-member/add-member.component';
import { SeasonsComponent } from './pages/admin/season/seasons/seasons.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { CreateSeasonComponent } from './pages/admin/season/create-season/create-season.component';
import { EditSeasonComponent } from './pages/admin/season/edit-season/edit-season.component';
import { ProgramsComponent } from './pages/admin/program/programs/programs.component';
import { CreateProgramComponent } from './pages/admin/program/create-program/create-program.component';
import { EditProgramComponent } from './pages/admin/program/edit-program/edit-program.component';
import { UsersComponent } from './pages/admin/user/users/users.component';
import { UserComponent } from './pages/admin/user/user/user/user.component';
import { AddCourseComponent } from './pages/registration/add-course/add-course.component';
import { CoursesComponent } from './pages/admin/course/courses/courses.component';
import { CreateCourseComponent } from './pages/admin/course/create-course/create-course.component';
import { RegistrationComponent } from './pages/registration/registration/registration.component';
import { AddMedicalSurveyComponent } from './pages/registration/add-medical-survey/add-medical-survey.component';
import { AddPaymentComponent } from './pages/registration/add-payment/add-payment.component';
import { ConfirmationComponent } from './pages/registration/confirmation/confirmation.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EditCourseComponent } from './pages/admin/course/edit-course/edit-course.component';
import { CourseComponent } from './pages/admin/course/course/course.component';
import { MembersByUserComponent } from './pages/members-by-user/members-by-user.component';
import { MembersComponent } from './pages/admin/member/members/members.component';
import { MemberComponent } from './pages/admin/member/member/member.component';
import { MemberDetailsComponent } from './pages/member-details/member-details.component';

export const routes: Routes = [
  {
    path: '',
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
    path: 'adherents/:id',
    component: MemberDetailsComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'adherents',
    component: MembersByUserComponent,
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
    path: 'inscription/adherent/:id/cours',
    component: AddCourseComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/:id/questionnaire-medical',
    component: AddMedicalSurveyComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/:id/paiement',
    component: AddPaymentComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'inscription/:id/confirmation',
    component: ConfirmationComponent,
    canActivate: [authGuard],
    data: {
      userType: 'guardian',
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
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
    path: 'admin/saisons/nouvelle-saison',
    component: CreateSeasonComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/saisons/:id',
    component: EditSeasonComponent,
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
  {
    path: 'admin/programmes/nouveau-programme',
    component: CreateProgramComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/programmes/:id',
    component: EditProgramComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/programmes',
    component: ProgramsComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/cours/nouveau-cours',
    component: CreateCourseComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/cours/:id/edition',
    component: EditCourseComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/cours/:id',
    component: CourseComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/cours',
    component: CoursesComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/utilisateurs/:id',
    component: UserComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/utilisateurs',
    component: UsersComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/adherents/:id',
    component: MemberComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
    },
  },
  {
    path: 'admin/adherents',
    component: MembersComponent,
    canActivate: [authGuard],
    data: {
      userType: 'admin',
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
];
