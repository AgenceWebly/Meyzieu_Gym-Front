import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../../../models/user.model';
import { ApiService } from '../../../../shared/services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: User[] = [];

  filteredUsers: User[] = [];
  searchTerm: string = '';

  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data.sort((a, b) => {
          if (a.lastname < b.lastname) return -1;
          if (a.lastname > b.lastname) return 1;
          return 0;
        });
        this.filteredUsers = [...this.users];
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue, veuillez réessayer ultérieurement', 'Erreur');
      },
    });
  }

  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter((user) =>
        user.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  navigateToUserPage(userId: number) {
    this.router.navigate(['/admin/utilisateurs', userId]);
  }
}
