import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loginError: string | null = null;

  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.loginError = "Identifiants incorrects. Veuillez réessayer.";
  }
}
