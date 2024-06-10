import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-create-season',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-season.component.html',
  styleUrl: './create-season.component.scss',
})
export class CreateSeasonComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);

  seasonForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor() {}

  submitForm() {
    if (this.seasonForm.valid) {
      console.log(this.seasonForm.value);

      this.apiService.createSeason(this.seasonForm.value).subscribe(() => {
        this.router.navigate(['/admin/saisons']);
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/saisons']);
  }
}
