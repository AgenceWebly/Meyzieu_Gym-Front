import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { Season } from '../../../../models/season.model';
import { Program } from '../../../../models/program.model';
import { ToastrService } from 'ngx-toastr';
import { FormUtilityService } from '../../../../shared/services/form-utility.service';

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
  daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  charCount: number = 255;

  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);
  formUtilityService = inject(FormUtilityService);

  courseForm = this.fb.group({
    programId: ['', Validators.required],
    seasonId: ['', Validators.required],
    courseName: [
      '',
      [Validators.minLength(2), Validators.maxLength(20), Validators.required],
    ],
    registrationStartDate: ['', Validators.required],
    registrationEndDate: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    maxMembers: [0, [Validators.required, Validators.min(1)]],
    minAge: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    maxAge: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    createTrainingSlotDtos: this.fb.array([]),
  });

  constructor() {}

  ngOnInit() {
    this.apiService.getPrograms().subscribe({
      next: (response) => {
        this.programs = response;
      },
      error: (err) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });

    this.apiService.getSeasons().subscribe({
      next: (response) => {
        this.seasons = response;
      },
      error: (err) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });

    this.courseForm.get('minAge')?.valueChanges.subscribe(() => {
      this.calculateYears();
    });
    this.courseForm.get('maxAge')?.valueChanges.subscribe(() => {
      this.calculateYears();
    });
  }

  get trainingSlots() {
    return this.courseForm.get('createTrainingSlotDtos') as FormArray;
  }

  addTrainingSlot() {
    const trainingSlotGroup = this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
    this.trainingSlots.push(trainingSlotGroup);
  }

  removeTrainingSlot(index: number) {
    this.trainingSlots.removeAt(index);
  }

  submitForm() {
    if (this.courseForm.valid) {
      const trimmedFormValues = this.formUtilityService.trimFormValues(this.courseForm);

      this.apiService.createCourse(trimmedFormValues).subscribe({
        next: () => {
          this.toastr.success('Cours créé avec succès', 'Succès');
          this.router.navigate(['/admin/cours']);
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
