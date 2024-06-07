import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loginError: string | null = null;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  storageService = inject(StorageService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const loginForm = this.loginForm.value;

    if (loginForm.email && loginForm.password) {
      this.authService.login(loginForm.email, loginForm.password).subscribe({
        next: (data) => {

          this.storageService.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          window.location.reload();
        },
        error: (err) => {
          this.loginError = 'Identifiants incorrects. Veuillez réessayer.';
          this.isLoginFailed = true;
        },
      });
    }
  }
}
