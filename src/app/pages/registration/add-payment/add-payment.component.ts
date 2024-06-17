import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);

  paymentForm = this.fb.group({
    paymentMethod: ['', Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.registrationId = parseInt(idParam, 10);
      } else {
        this.toastr.error("ID de l'inscription non trouvé", 'Erreur');
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
        registrationStatus: 'registration validated',
      };

      this.apiService
        .updateRegistration(registrationData, this.registrationId)
        .subscribe({
          next: () => {
            this.toastr.success(
              "Merci de procéder au règlement de l'inscription",
              'Mode de paiement pris en compte'
            );
            if (selectedPaymentMethod.includes('cb')) {
              this.router.navigate(
                ['inscription/' + this.registrationId + '/confirmation'],
                {
                  queryParams: { method: selectedPaymentMethod },
                }
              );
            } else {
              this.router.navigate(
                ['inscription/' + this.registrationId + '/confirmation'],
                {
                  queryParams: { method: 'autre' },
                }
              );
            }
          },
          error: (err) => {
            console.error('Error updating registration:', err);
            this.toastr.error(
              'Une erreur est survenue. Veuillez réessayer ultérieurement.',
              'Erreur'
            );
          },
        });
    } else {
      this.toastr.error('Veuillez sélectionner un mode de paiement', 'Erreur');
    }
  }
}
