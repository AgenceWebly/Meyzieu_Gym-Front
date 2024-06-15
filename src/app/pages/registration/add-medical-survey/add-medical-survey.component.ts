import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-medical-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-medical-survey.component.html',
  styleUrl: './add-medical-survey.component.scss',
})
export class AddMedicalSurveyComponent {
  registrationId!: number;
  showHealthCertificateMessage: boolean = false;

  private destroy$ = new Subject<void>();

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  medicalForm = this.fb.group({
    q1: [null, Validators.required],
    q2: [null, Validators.required],
    q3: [null, Validators.required],
    q4: [null, Validators.required],
    q5: [null, Validators.required],
    q6: [null, Validators.required],
    q7: [null, Validators.required],
    q8: [null, Validators.required],
    q9: [null, Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.registrationId = parseInt(idParam, 10);
      } else {
        this.toastr.error(
          'Une erreur est survenue. Veuillez réessayer ultérieurement',
          'Erreur'
        );
      }
    });

    this.medicalForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((values) => {
      this.checkHealthCertificateRequirement(values);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkHealthCertificateRequirement(questions: any) {
    this.showHealthCertificateMessage = Object.values(questions).some(
      (value) => value === 'oui'
    );
  }

  submitForm() {
    if (this.medicalForm.valid) {
      const isHealthCertificateRequired = this.showHealthCertificateMessage;
      const healthCertificateData = {
        id: this.registrationId,
        isHealthCertificateRequired: isHealthCertificateRequired,
        healthCertificateFileUrl: null,
        registrationStatus: 'medical validated',
      };

      this.apiService
        .updateRegistration(healthCertificateData, this.registrationId)
        .subscribe({
          next: (response) => {
            this.toastr.success('Informations prises en compte', 'Succès');
            this.router.navigate([
              '/inscription/' + this.registrationId + '/paiement',
            ]);
          },
          error: (err) => {
            console.error(err);
            this.toastr.error(
              'Une erreur est survenue. Veuillez réessayer ultérieurement.',
              'Erreur'
            );
          },
        });
    } else {
      this.toastr.error(
        "Veuillez répondre à l'ensemble du questionnaire",
        'Erreur'
      );
    }
  }
}
