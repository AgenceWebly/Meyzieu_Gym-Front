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
        console.log(data);
      },
      error: (err: any) => {
        this.toastr.error(
          'Une erreur est survenue. Veuillez réessayer ultérieurement.',
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
    switch (member.registrationStatus) {
      case 'cours choisi':
        path = `inscription/${member.registrationId}/questionnaire-medical`;
        break;
      case 'questionnaire médical complété':
        path = `inscription/${member.registrationId}/paiement`;
        break;
      default:
        path = `inscription/adherent/${member.id}/cours`;
    }
    this.router.navigate([path]);
  }
}
