import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../shared/services/address.service';
import { CommonModule } from '@angular/common';
import { checkEqualityValidator } from '../../shared/validators/check-equality.validator';
import { phoneFormatValidator } from '../../shared/validators/phone-format.validator';
import { AddressFeature } from '../../models/addressFeature.model';
import { passwordStrengthValidator } from '../../shared/validators/password-strength.validator';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { FormUtilityService } from '../../shared/services/form-utility.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  passwordStrengthClass = 'weak';
  passwordStrengthPercent = 0;
  passwordMessage = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  private destroy$ = new Subject<void>();

  fb = inject(FormBuilder);
  addressService = inject(AddressService);
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  formUtilityService = inject(FormUtilityService);
  
  signUpForm = this.fb.group({
    lastname: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Zà-ÿÀ-Ÿ\s'-]+$/),
      ],
    ],
    firstname: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Zà-ÿÀ-Ÿ\s'-]+$/),
      ],
    ],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phoneNumber: [null, [Validators.required, phoneFormatValidator()]],
    occupation: ['', [Validators.required, Validators.minLength(2)]],
    emails: this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      },
      {
        validator: checkEqualityValidator('email', 'confirmEmail'),
      }
    ),
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
    this.signUpForm
      .get('passwords.password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkPasswordStrength();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkPasswordStrength(): void {
    const passwordControl = this.signUpForm.get('passwords.password');
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

  signup() {
    if (this.signUpForm.valid) {
      const trimmedFormValues = this.formUtilityService.trimFormValues(this.signUpForm);

      const signupForm = {
        firstname: trimmedFormValues['firstname'],
        lastname: trimmedFormValues['lastname'],
        email: trimmedFormValues['emails'].email,
        password: trimmedFormValues['passwords'].password,
        phoneNumber: trimmedFormValues['phoneNumber'],
        address: trimmedFormValues['address'],
        occupation: trimmedFormValues['occupation'],
      };

      this.authService.signup(signupForm).subscribe({
        next: () => {
          this.toastr.success('Inscription réussie', 'Succès');
          this.router.navigate(['/connexion']);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(
            'Une erreur est survenue, veuillez réessayer ultérieurement',
            'Erreur'
          );
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
