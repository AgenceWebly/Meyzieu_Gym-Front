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
      console.log('Form Submitted', this.seasonForm.value);
      //this.router.navigate(['/saisons']);
    }
  }

  cancel() {
    this.router.navigate(['/admin/saisons']);
  }
}
