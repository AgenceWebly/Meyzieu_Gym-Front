import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { Season } from '../../../../models/season.model';
import { Program } from '../../../../models/program.model';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss',
})
export class CreateCourseComponent {
  seasons: Season[] = [];
  programs: Program[] = [];
  minYear: number | null = null;
  maxYear: number | null = null;

  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);
  charCount: number = 255;

  courseForm = this.fb.group({
    programId: ['', Validators.required],
    seasonId: ['', Validators.required],
    registrationStartDate: ['', Validators.required],
    registrationEndDate: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    maxMembers: [0, [Validators.required, Validators.min(1)]],
    minAge: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    maxAge: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  constructor() {}

  ngOnInit() {
    this.apiService.getPrograms().subscribe((response) => {
      this.programs = response;
    });
    this.apiService.getSeasons().subscribe((response) => {
      this.seasons = response;
    });
    this.courseForm.get('minAge')?.valueChanges.subscribe(() => {
      this.calculateYears();
    });
    this.courseForm.get('maxAge')?.valueChanges.subscribe(() => {
      this.calculateYears();
    });
  }

  submitForm() {
    if (this.courseForm.valid) {
      console.log(this.courseForm.value);
      this.apiService.createCourse(this.courseForm.value).subscribe(() => {
        this.router.navigate(['/admin/cours']);
      });
    }
  }
  calculateYears() {
    const currentYear = new Date().getFullYear();
    const minAge = this.courseForm.get('minAge')?.value;
    const maxAge = this.courseForm.get('maxAge')?.value;

    if (minAge && maxAge) {
      this.minYear = minAge !== null ? currentYear - minAge : null;
      this.maxYear = maxAge !== null ? currentYear - maxAge : null;
    }
  }

  goBack() {
    this.router.navigate(['/admin/cours']);
  }
}
