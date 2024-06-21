import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { Course } from '../../../../models/course.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  courseId!: number;
  course!: Course;
  minYear: number | null = null;
  maxYear: number | null = null;

  apiService = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.courseId = parseInt(idParam, 10);

        if (!isNaN(this.courseId)) {
          this.apiService.getCourseById(this.courseId).subscribe({
            next: (course) => {
              this.course = course;
              this.calculateYears();
              console.log(course);
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
  }

  calculateYears() {
    const currentYear = new Date().getFullYear();

    if (this.course.minAge && this.course.maxAge) {
      this.minYear =
        this.course.minAge !== null ? currentYear - this.course.minAge : null;
      this.maxYear =
        this.course.maxAge !== null ? currentYear - this.course.maxAge : null;
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/cours']);
  }

  editCourse(): void {
    this.router.navigate([`/admin/cours/${this.courseId}/edition`]);
  }
}
