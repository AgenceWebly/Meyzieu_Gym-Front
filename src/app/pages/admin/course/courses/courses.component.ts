import { Component, inject } from '@angular/core';
import { Course } from '../../../../models/course.model';
import { ApiService } from '../../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  courses: Course[] = [];

  filteredCourses: Course[] = [];
  searchTerm: string = '';

  apiService = inject(ApiService);
  router = inject(Router);
  toastr = inject(ToastrService);

  constructor() {}

  ngOnInit() {
    this.apiService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = data;
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue', 'Erreur');
      }
    });
  }

  editCourse(courseId: number) {
    this.router.navigate(['/admin/cours', courseId]);
  }

  addCourse() {
    this.router.navigate(['/admin/cours/nouveau-cours']);
  }

  filterCourses() {
    if (this.searchTerm) {
      this.filteredCourses = this.courses.filter((course) =>
        course.program.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCourses = [...this.courses];
    }
  }
}
