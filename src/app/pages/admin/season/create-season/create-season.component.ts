import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-season',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-season.component.html',
  styleUrl: './create-season.component.scss'
})
export class CreateSeasonComponent {

  fb = inject(FormBuilder);
  router = inject(Router);

  seasonForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor() {}

  submitForm() {
    if (this.seasonForm.valid) {
      // Save the season data and navigate back to the seasons list
      console.log('Form Submitted', this.seasonForm.value);
      // Here you would call your service to save the season data
      this.router.navigate(['/seasons']);
    }
  }

  cancel() {
    this.router.navigate(['/seasons']);
  }
}
