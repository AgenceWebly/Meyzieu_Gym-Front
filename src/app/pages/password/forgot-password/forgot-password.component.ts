import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loginError: string | null = null;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    const forgotPasswordForm = this.forgotPasswordForm.value;

    if (forgotPasswordForm.email) {
      this.authService.forgotPassword(forgotPasswordForm.email).subscribe({
        next: (data) => {
          this.toastr.success(
            'Email envoyé',
            'Réinitialisation mot de passe'
          );
          this.router.navigate(['confirmation-mot-de-passe']);
        },
        error: (err) => {
          if (err.status !== 401) {
            this.toastr.error(
              'Une erreur est survenue, veuillez réessayer ultérieurement',
              'Erreur'
            );
          }
        },
      });
    }
  }
}
