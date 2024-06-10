import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../../../models/user.model';
import { ApiService } from '../../../../shared/services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = data;
    });
  }

  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(
        (user) => user.lastname.toLowerCase() === this.searchTerm.toLowerCase()
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  navigateToUserPage(userId: number) {
    this.router.navigate(['/admin/utilisateurs', userId]);
  }
}
