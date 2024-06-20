import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Season } from '../../../../models/season.model';
import { Program } from '../../../../models/program.model';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss',
})
export class EditCourseComponent {
  courseId!: number;
  seasons: Season[] = [];
  programs: Program[] = [];
  minYear: number | null = null;
  maxYear: number | null = null;
  daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  charCount: number = 255;

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.courseId = parseInt(idParam, 10);

        if (!isNaN(this.courseId)) {
          this.apiService.getCourseById(this.courseId).subscribe({
            next: (course) => {
              console.log(course);

              this.courseForm.patchValue({
                programId: course.program.id,
                seasonId: course.season.id,
                courseName: course.courseName,
                registrationStartDate: course.registrationStartDate,
                registrationEndDate: course.registrationEndDate,
                maxMembers: course.maxMembers,
                minAge: course.minAge,
                maxAge: course.maxAge,
                price: course.price,
              });
              this.initializeTrainingSlots(course.trainingSlots);
              console.log(this.courseForm.value);
            },
            error: (err) => {
              this.toastr.error(
                'Une erreur est survenue, veuillez réessayer ultérieurement',
                'Erreur'
              );
            },
          });
        } else {
          this.toastr.error('ID du cours invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID du cours non trouvé', 'Erreur');
      }
    });

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
  }

  get trainingSlots() {
    return this.courseForm.get('createTrainingSlotDtos') as FormArray;
  }

  createTrainingSlotGroup(trainingSlot: any = { day: '', startTime: '', endTime: '' }) {
    return this.fb.group({
      day: [trainingSlot.day, Validators.required],
      startTime: [trainingSlot.startTime, Validators.required],
      endTime: [trainingSlot.endTime, Validators.required],
    });
  }

  initializeTrainingSlots(trainingSlots: any[]) {
    trainingSlots.forEach(slot => {
      this.trainingSlots.push(this.createTrainingSlotGroup(slot));
    });
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

  submitForm(): void {
    if (this.courseForm.valid) {
      this.apiService
        .updateCourse(this.courseForm.value, this.courseId)
        .subscribe({
          next: () => {
            this.toastr.success('Cours mis à jour avec succès', 'Succès');
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

  goBack(): void {
    this.router.navigate(['/admin/cours']);
  }
}
