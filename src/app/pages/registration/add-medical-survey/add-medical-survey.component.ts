import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';

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

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

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
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.registrationId = parseInt(idParam, 10);
      } else {
        console.error("ID de l'inscription non trouvé");
      }
    });

    this.medicalForm.valueChanges.subscribe((values) => {
      this.checkHealthCertificateRequirement(values);
    });
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
      };

      console.log(healthCertificateData);
      this.apiService
        .updateRegistration(healthCertificateData)
        .subscribe((response: number) => {
          console.log(response);
          // this.router.navigate([
          //   '/inscription/' + this.registrationId + /paiement',
          // ]);
        });
    }
  }
}
