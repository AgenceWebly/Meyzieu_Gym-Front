import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-medical-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-medical-survey.component.html',
  styleUrl: './add-medical-survey.component.scss'
})
export class AddMedicalSurveyComponent {
  memberId!: number;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

  medicalForm = this.fb.group({
    gender: ['', Validators.required],
  });

  submitMedicalForm() {
    if (this.medicalForm.valid) {
      this.router.navigate([
        '/inscription/adherent/' + this.memberId + '/questionnaire-medical',
      ]);
    }
  }
}
