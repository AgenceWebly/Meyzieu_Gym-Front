import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';

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

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        console.log('toto');

        this.storageService.clean();

        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
