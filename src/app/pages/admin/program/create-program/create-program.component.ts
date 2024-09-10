import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastrService } from 'ngx-toastr';
import { FormUtilityService } from '../../../../shared/services/form-utility.service';

@Component({
  selector: 'app-create-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSwitchModule],
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.scss',
})
export class CreateProgramComponent {
  charCount: number = 255;

  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);
  formUtilityService = inject(FormUtilityService);
  
  programForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    ],
    includingCompetition: [false],
  });

  constructor() {}

  submitForm() {
    if (this.programForm.valid) {

      const trimmedFormValues = this.formUtilityService.trimFormValues(this.programForm);

      this.apiService.createProgram(trimmedFormValues).subscribe({
        next: () => {
          this.toastr.success('Programme créé avec succès', 'Succès');
          this.router.navigate(['/admin/programmes']);
        },
        error: (err) => {
          this.toastr.error(
            'Une erreur est survenue, veuillez réessayer ultérieurement',
            'Erreur'
          );
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/programmes']);
  }

  updateCharacterCount(): void {
    const descriptionControl = this.programForm.get('description');
    if (descriptionControl && descriptionControl.value) {
      this.charCount = 255 - descriptionControl.value.length;
    } else {
      this.charCount = 255;
    }
  }
}
