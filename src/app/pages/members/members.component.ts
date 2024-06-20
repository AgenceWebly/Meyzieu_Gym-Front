import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  currentUser: any;
  members: any[] = [];

  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    const currentUserId = this.storageService.getUser().id;
    this.apiService.getMembersByUserId(currentUserId, false).subscribe({
      next: (data: any) => {
        this.members = data;
      },
      error: (err: any) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });
  }
}
