import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss',
})
export class AddPaymentComponent {
  registrationId!: number;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

  paymentForm = this.fb.group({
    paymentMethod: ['', Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.registrationId = parseInt(idParam, 10);
      } else {
        console.error("ID de l'inscription non trouvé");
      }
    });
  }

  submitForm() {
    if (this.paymentForm.valid) {
      const selectedPaymentMethod =
        this.paymentForm.get('paymentMethod')?.value!;

      const registrationData = {
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod.includes('cb')
          ? 'en attente'
          : 'non payé',
        registrationStatus: 'inscription complétée',
      };

      this.apiService
        .updateRegistration(registrationData, this.registrationId)
        .subscribe({
          next: () => {
            if (selectedPaymentMethod.includes('cb')) {
              this.router.navigate(['inscription/' + this.registrationId + '/confirmation'], {
                queryParams: { method: selectedPaymentMethod },
              });
            } else {
              this.router.navigate(['inscription/' + this.registrationId + '/confirmation'], {
                queryParams: { method: 'autre' },
              });
            }
          },
          error: (err) => {
            console.error('Error updating registration:', err);
          },
        });
    }
  }
}
