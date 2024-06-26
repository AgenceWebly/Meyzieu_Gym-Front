import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CalculateDurationService } from '../../../shared/services/calculate-duration.service';
import { TrainingSlot } from '../../../models/trainingSlot';
import { StorageService } from '../../../shared/services/storage.service';

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
  storageService = inject(StorageService);

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
            console.log(this.registration);
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

            let userEmail = this.storageService.getUser().email;

            let message =
              "Bonjour,\n\nL'inscription de " +
              this.registration.memberFirstname +
              ' au cours ' +
              this.registration.courseName +
              ' a bien été prise en compte.\n\nPour que cette inscription soit valide, nous vous remercions de procéder au règlement de la somme de ' +
              this.registration.registrationFee +
              ' euros selon le mode de règlement choisi :\n';

            switch (selectedPaymentMethod) {
              case 'cb':
                message +=
                  'Vous avez opté pour un règlement par carte bancaire en une seule fois via le lien HelloAsso : https://www.helloasso.com/associations/meyzieu-gym-artistique/adhesions/inscription-saison-2024-2025';
                break;
              case 'cb3x':
                message +=
                  'Vous avez opté pour un règlement par carte bancaire en 3 fois via le lien HelloAsso https://www.helloasso.com/associations/meyzieu-gym-artistique/adhesions/inscription-saison-2024-2025';
                break;
              default:
                message +=
                  'Vous avez opté pour un règlement par chèque, espèces ou chèques vacances :\n des permanences sont organisées au Gymnase du Carreau pour que vous puissiez déposer votre règlement le jeudi 27 juin 2024 de 18h à 19h et le jeudi 4 juillet 2024 de 18h à 19h';
            }

            message +=
              "\n\nÀ très bientôt sur notre plateforme !\n\nSportivement,\nL'équipe Meyzieu Gym";

            this.apiService
              .sendEmail({
                to: userEmail,
                subject:
                  "Ne pas répondre - Confirmation d'inscription " +
                  this.registration.memberFirstname,
                message: message,
              })
              .subscribe((data) => {
                console.log('Email envoyé avec succès:');
              });
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
