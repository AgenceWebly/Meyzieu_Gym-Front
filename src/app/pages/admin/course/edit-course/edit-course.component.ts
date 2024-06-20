import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss'
})
export class EditCourseComponent {
  courseId!: number;
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  courseForm = this.fb.group({
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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.courseId = parseInt(idParam, 10);

        if (!isNaN(this.courseId)) {
          this.apiService.getCourseById(this.courseId).subscribe({
            next: (course) => {
              this.courseForm.patchValue({
                name: course.name,
                description: course.description,
                includingCompetition: course.includingCompetition,
              });
            },
            error: (err) => {              
              this.toastr.error('Une erreur est survenue, veuillez réessayer ultérieurement', 'Erreur');
            },
          });
        } else {
          this.toastr.error('ID du cours invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID du cours non trouvé', 'Erreur');
      }
    });
  }

  submitForm(): void {
    if (this.courseForm.valid) {
      this.apiService.updateProgram(this.courseForm.value, this.courseId).subscribe({
        next: () => {
          this.toastr.success('Cours mis à jour avec succès', 'Succès');
          this.router.navigate(['/admin/cours']);
        },
        error: (err) => {
          this.toastr.error('Une erreur est survenue, veuillez réessayer ultérieurement', 'Erreur');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/cours']);
  }
}
