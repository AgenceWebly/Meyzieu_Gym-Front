import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  currentUser: any;
  members: any[] = [];
  messageError = '';

  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);

  ngOnInit(): void {
    const currentUserId = this.storageService.getUser().id;
    this.apiService.getMembers(currentUserId).subscribe({
      next: (data: any) => {
        this.members = data;
      },
      error: (err: any) => {
        this.messageError = err.message;
        console.log(err.message);
      },
    });
  }

  addNewMember(): void {
    this.router.navigate(['inscription/nouvel-adherent']);
  }
}
