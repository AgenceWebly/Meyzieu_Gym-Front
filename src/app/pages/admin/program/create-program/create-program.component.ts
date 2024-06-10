import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-create-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSwitchModule],
  templateUrl: './create-program.component.html',
  styleUrl: './create-program.component.scss',
})
export class CreateProgramComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);

  programForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    includingCompetition: [false],
  });

  constructor() {}

  submitForm() {
    if (this.programForm.valid) {
      this.apiService.createProgram(this.programForm.value).subscribe(() => {
        console.log(this.programForm.value);
        this.router.navigate(['/admin/cours']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/cours']);
  }
}
