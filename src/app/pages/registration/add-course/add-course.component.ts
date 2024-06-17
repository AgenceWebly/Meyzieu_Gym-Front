import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { Course } from '../../../models/course.model';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent {
  memberId!: number;
  currentUserId!: number;
  discount: number = 0;
  membersRegisteredThisSeason: number = 1;

  courses!: Course[];

  coursesFilteredByAge: Course[] = this.courses;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  storageService = inject(StorageService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);
        // Récupérer les info du member et filtrer courses en fonction de l'âge
        this.apiService.getCourses().subscribe({
          next: (response) => {
            this.courses = response;
            this.coursesFilteredByAge = response;
          },
          error: (err) => {
            this.toastr.error(
              'Une erreur est survenue. Veuillez réessayer ultérieurement',
              'Erreur'
            );
          },
        });
      } else {
        this.toastr.error(
          'Une erreur est survenue. Veuillez réessayer ultérieurement',
          'Erreur'
        );
      }
    });

    // this.currentUserId = this.storageService.getUser().id;
    // this.apiService.getUserById(this.currentUserId).subscribe((user) => {
    //   this.calculateDiscount(user);
    // });
  }


  calculateDiscount(user: User) {
    for (const member of user.members) {
      for (const registration of member.registrations) {
        if (
          registration.course.season.startDate ===
          this.courses[0].season.startDate
        ) {
          this.membersRegisteredThisSeason++;
          break;
        }
      }
    }
    if (this.membersRegisteredThisSeason === 1) {
      this.discount = 10;
    } else if (this.membersRegisteredThisSeason <= 2) {
      this.discount = 30;
    }
  }

  registerCourse(courseId: number, coursePrice: number) {
    let registrationData = {
      memberId: this.memberId,
      courseId: courseId,
      registrationFee: coursePrice - this.discount,
      paymentMethod: 'aucun',
      paymentStatus: 'non payé',
      registrationStatus: 'cours choisi',
      healthCertificateFileUrl: null,
      isHealthCertificateRequired: null,
    };

    this.apiService.createRegistration(registrationData).subscribe({
      next: (data) => {
        this.toastr.success(
          'Merci de répondre au questionnaire médical',
          'Groupe pris en compte'
        );
        this.router.navigate([
          '/inscription/' + data + '/questionnaire-medical',
        ]);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(
          'Une erreur est survenue : ' + err.error.message,
          'Erreur'
        );
      },
    });
  }
}
