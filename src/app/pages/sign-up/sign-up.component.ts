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

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  
  addressSuggestions: any[] = [];

  passwordStrengthClass = 'weak';
  passwordStrengthPercent = 0;
  passwordMessage = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  fb = inject(FormBuilder);
  addressService = inject(AddressService);
  authService = inject(AuthService);
  router = inject(Router);

  signUpForm = this.fb.group({
    lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phoneNumber: [null, [Validators.required, phoneFormatValidator()]],
    occupation: ['', [Validators.required, Validators.minLength(2)]],
    emails: this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      },
      {
        validator: checkEqualityValidator('email', 'confirmEmail')
      }
    ),
    passwords: this.fb.group(
      {
        password: ['', [Validators.required, passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: checkEqualityValidator('password', 'confirmPassword')
      }
    )
  });

  ngOnInit(): void {
    this.signUpForm.get('address')?.valueChanges.subscribe((value) => {
      if (value && value.length >= 4) {
        this.addressService.searchAddress(value).subscribe((response) => {
          const res = response.features.some((item: AddressFeature) => item.properties.label === value)
          if(!res) {
            this.addressSuggestions = response.features;
          }
        });
      } else {
        this.addressSuggestions = [];
      }
    });

    this.signUpForm.get('passwords.password')?.valueChanges.subscribe(() => {
      this.checkPasswordStrength();
    });
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

      const strength = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial, isLengthValid].filter(Boolean).length;

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

  selectAddress(address: any): void {
    this.signUpForm.patchValue({ address: address.properties.label });
    this.addressSuggestions = [];
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  signup() {
    const signupForm = {
      firstname: this.signUpForm.value.firstname,
      lastname: this.signUpForm.value.lastname,
      email: this.signUpForm.value.emails.email,
      password: this.signUpForm.value.passwords.password,
      phoneNumber: this.signUpForm.value.phoneNumber,
      address: this.signUpForm.value.address,
      occupation: this.signUpForm.value.occupation
    }

    this.authService.signup(signupForm).subscribe(() => {
      this.router.navigate(['/connexion']);
    });
  }
}
