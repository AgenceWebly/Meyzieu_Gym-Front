import { NavItem } from "../models/navItem.model";

export const navItems: NavItem[] = [
  {
    path: '/accueil',
    icon: 'fa-light fa-house',
    text: 'Accueil',
    category: 1,
    userType: 'all'
  },
  {
    path: '/profil',
    icon: 'fa-light fa-user',
    text: 'Mon profil',
    category: 1,
    userType: 'ROLE_USER'
  },
  {
    path: '/adherents',
    icon: 'fa-light fa-users',
    text: 'Adhérents',
    category: 1,
    userType: 'ROLE_GUARDIAN'
  },
  {
    path: '/entrainements',
    icon: 'fa-light fa-calendar',
    text: 'Entraînements',
    category: 1,
    userType: 'ROLE_GUARDIAN'
  },
  {
    path: '/competitions',
    icon: 'fa-sharp fa-light fa-medal',
    text: 'Compétitions',
    category: 1,
    userType: 'ROLE_GUARDIAN'
  },
  {
    path: '/inscription',
    icon: 'fa-light fa-users-medical',
    text: 'Nouvelle inscription',
    category: 2,
    userType: 'ROLE_GUARDIAN'
  },
  {
    path: '/contact',
    icon: 'fa-light fa-message-pen',
    text: 'Contacter le club',
    category: 3,
    userType: 'all'
  },
  {
    path: '/options',
    icon: 'fa-light fa-gear',
    text: 'Options',
    category: 3,
    userType: 'ROLE_USER'
  },
  {
    path: '/deconnexion',
    icon: 'fa-light fa-right-from-bracket',
    text: 'Déconnexion',
    category: 3,
    userType: 'ROLE_USER'
  },
  {
    path: '/connexion',
    icon: 'fa-light fa-left-to-bracket',
    text: 'Me connecter',
    category: 3,
    userType: 'visitorOnly'
  },
  {
    path: '/creation-compte',
    icon: 'fa-light fa-user-plus',
    text: 'Créer un compte',
    category: 3,
    userType: 'visitorOnly'
  },
  {
    path: '/admin',
    icon: 'fa-light fa-user-plus',
    text: 'Admin',
    category: 1,
    userType: 'ROLE_ADMIN'
  },

]