import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { Course } from '../../../models/course.model';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../models/user.model';

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

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);
        //Récupérer les info du member et filrer courses en fonction de l'age
      } else {
        console.error("ID de l'adhérent non trouvé");
      }
    });

    this.apiService.getCourses().subscribe((response) => {
      console.log(response);

      this.courses = response;
      this.coursesFilteredByAge = response;
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
    if (this.membersRegisteredThisSeason === 2) {
      this.discount = 10;
    } else if (this.membersRegisteredThisSeason <= 3) {
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
      registrationStatus: 'inscription en cours',
      healthCertificateFileUrl: null,
      isHealthCertificateRequired: null,
    };

    this.apiService.createRegistration(registrationData).subscribe((data) => {
      this.router.navigate(['/inscription/' + data + '/questionnaire-medical']);
    });
  }
}
