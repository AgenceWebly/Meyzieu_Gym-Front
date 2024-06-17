import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  router = inject(Router);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();
        window.location.reload();
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue', 'Erreur');
      },
    });
  }
}
