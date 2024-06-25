import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CalculateDurationService } from '../../../shared/services/calculate-duration.service';
import { TrainingSlot } from '../../../models/trainingSlot';

@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.scss',
})
export class AddPaymentComponent {
  registrationId!: number;
  registration!: any;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);
  calculateDuration = inject(CalculateDurationService);

  paymentForm = this.fb.group({
    paymentMethod: ['', Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.registrationId = parseInt(idParam, 10);
        this.apiService.getRegistrationById(this.registrationId).subscribe({
          next: (registration: any) => {
            this.registration = registration;
          },
          error: (err) => {
            this.toastr.error(
              'Une erreur est survenue, veuillez réessayer ultérieurement',
              'Erreur'
            );
          },
        });
      } else {
        this.toastr.error("ID de l'inscription non trouvé", 'Erreur');
      }
    });
  }

  calculateWeeklyDuration(trainingSlots: TrainingSlot[]) {
    return this.calculateDuration.calculateWeeklyDuration(trainingSlots);
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
        registrationStatus: 'mode de paiement choisi',
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
              'Une erreur est survenue, veuillez réessayer ultérieurement',
              'Erreur'
            );
          },
        });
    } else {
      this.toastr.error('Veuillez sélectionner un mode de paiement', 'Erreur');
    }
  }
}
