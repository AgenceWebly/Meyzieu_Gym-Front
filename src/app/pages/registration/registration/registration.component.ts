import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../../models/member.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  currentUser: any;
  members: any[] = [];
  messageError = '';

  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    const currentUserId = this.storageService.getUser().id;
    this.apiService.getMembersByUserId(currentUserId, true).subscribe({
      next: (data: any) => {
        this.members = data;
      },
      error: (err: any) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Error'
        );
      },
    });
  }

  addNewMember(): void {
    this.router.navigate(['inscription/nouvel-adherent']);
  }

  goToRightPage(member: Member) {
    let path = '';
    let toastrMessage = '';
    let toastTitle = `Reprenez l'inscription de ${member.firstname}`;
    switch (member.registrationStatus) {
      case 'cours choisi':
        path = `inscription/${member.registrationId}/questionnaire-medical`;
        toastrMessage = 'Merci de compléter le questionnaire médical';
        break;
      case 'questionnaire médical complété':
        path = `inscription/${member.registrationId}/paiement`;
        toastrMessage = 'Merci de choisir votre mode de paiement';
        break;
      default:
        path = `inscription/adherent/${member.id}/cours`;
        toastrMessage = `Merci de choisir le cours souhaité pour ${member.firstname}`;
        toastTitle = 'Inscription';
    }
    this.toastr.success(toastrMessage, toastTitle);
    this.router.navigate([path]);
  }
}
