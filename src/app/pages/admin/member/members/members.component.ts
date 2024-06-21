import { Component, inject } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Member } from '../../../../models/member.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  members!: Member[];
  filteredMembers!: Member[];
  searchTerm: string = '';

  apiService = inject(ApiService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit() {
    this.apiService.getMembers().subscribe({
      next: (data) => {
        this.members = data.sort((a, b) => {
          if (a.lastname < b.lastname) return -1;
          if (a.lastname > b.lastname) return 1;
          return 0;
        });
        this.filteredMembers = [...this.members];
        console.log(this.members);
      },
      error: (err) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });
  }

  filterMembers() {
    if (this.searchTerm) {
      this.filteredMembers = this.members.filter((member) =>
        member.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredMembers = [...this.members];
    }
  }

  navigateToMemberPage(memberId: number) {
    this.router.navigate(['/admin/utilisateurs', memberId]);
  }
}
