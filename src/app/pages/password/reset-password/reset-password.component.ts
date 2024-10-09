import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { checkEqualityValidator } from '../../../shared/validators/check-equality.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  passwordStrengthClass = 'weak';
  passwordStrengthPercent = 0;
  passwordMessage = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  token!: string | null;
  email!: string | null;

  private destroy$ = new Subject<void>();

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  resetPasswordForm = this.fb.group({
    passwords: this.fb.group(
      {
        password: ['', [Validators.required, passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: checkEqualityValidator('password', 'confirmPassword'),
      }
    ),
  });

  ngOnInit(): void {
    this.resetPasswordForm
      .get('passwords.password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkPasswordStrength();
      });

      this.route.queryParamMap.subscribe(params => {
        this.token = params.get('token');
        this.email = params.get('email');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkPasswordStrength(): void {
    const passwordControl = this.resetPasswordForm.get('passwords.password');
    if (passwordControl) {
      const value = passwordControl.value;
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecial = /[\W_]+/.test(value);
      const isLengthValid = value.length >= 8;

      const strength = [
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial,
        isLengthValid,
      ].filter(Boolean).length;

      if (strength < 3) {
        this.passwordStrengthClass = 'weak';
        this.passwordStrengthPercent = 33;
        this.passwordMessage = 'Mot de passe faible';
      } else if (strength === 3 || strength === 4) {
        this.passwordStrengthClass = 'medium';
        this.passwordStrengthPercent = 66;
        this.passwordMessage = 'Mot de passe moyen';
      } else {
        this.passwordStrengthClass = 'strong';
        this.passwordStrengthPercent = 100;
        this.passwordMessage = 'Mot de passe fort';
      }
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.passwords.password, this.email).subscribe({
        next: () => {
          this.toastr.success('Mot de passe réinitialisé', 'Succès');
          this.router.navigate(['/connexion']);
        },
        error: (err) => {
        const errorMessage = err.error; 
        this.toastr.error(errorMessage.message, 'Erreur');
        },
      });
    } else {
      this.toastr.error(
        'Veuillez remplir tous les champ du formulaire',
        'Erreur'
      );
    }
  }
}
