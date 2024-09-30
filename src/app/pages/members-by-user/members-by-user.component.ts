import { Component, inject } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members-by-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-by-user.component.html',
  styleUrl: './members-by-user.component.scss',
})
export class MembersByUserComponent {
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
        console.log(currentUserId);
        
        console.log(this.members);
      },
      error: (err: any) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });
  }

  goToMemberDetails(memberId: number) {
    this.router.navigate([`/adherents/${memberId}`]);
  }
}
