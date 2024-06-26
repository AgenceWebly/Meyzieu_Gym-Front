import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { Course } from '../../../models/course.model';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { TrainingSlot } from '../../../models/trainingSlot';
import { CalculateDurationService } from '../../../shared/services/calculate-duration.service';
import { Member } from '../../../models/member.model';
import { competitions } from '../../../data/competition.data';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent {
  memberId!: number;
  currentMember!: Member;
  currentUserId!: number;
  discount!: number;
  membersRegisteredThisSeason!: number;
  currentYear!: number;
  isModalOpen = false;
  selectedCourse!: Course;

  courses!: Course[];

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  storageService = inject(StorageService);
  toastr = inject(ToastrService);
  calculateDuration = inject(CalculateDurationService);

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);
        this.apiService.getAvailableCourses(this.memberId).subscribe({
          next: (coursesResponse) => {
            this.apiService.getMemberByIdForUser(this.memberId).subscribe({
              next: (memberResponse) => {
                this.currentMember = memberResponse;
                if (
                  competitions.some(
                    (member) =>
                      member.lastname.toLowerCase() ===
                        this.currentMember.lastname.toLowerCase() &&
                      member.firstname.toLowerCase() ===
                        this.currentMember.firstname.toLowerCase()
                  )
                ) {
                  const competitionsMemberCourseName = competitions.find(
                    (member) =>
                      member.lastname.toLowerCase() ===
                        this.currentMember.lastname.toLowerCase() &&
                      member.firstname.toLowerCase() ===
                        this.currentMember.firstname.toLowerCase()
                  )?.courseName;

                  this.courses = coursesResponse.filter((course) => {
                    return (
                      course.courseName.toLowerCase() ===
                        competitionsMemberCourseName?.toLowerCase() ||
                      (!course.courseName
                        .toLowerCase()
                        .startsWith('Compétition'.toLowerCase()) &&
                        !course.courseName
                          .toLowerCase()
                          .startsWith('Loisirs Perf'.toLowerCase()) &&
                        !course.program.name
                          .toLowerCase()
                          .startsWith('Compétition'.toLowerCase()) &&
                        !course.program.name
                          .toLowerCase()
                          .startsWith('Loisirs Perf'.toLowerCase()))
                    );
                  });
                } else {
                  this.courses = coursesResponse.filter((course) => {
                    return (
                      !course.courseName
                        .toLowerCase()
                        .startsWith('Compétition'.toLowerCase()) &&
                      !course.courseName
                        .toLowerCase()
                        .startsWith('Loisirs Perf'.toLowerCase()) &&
                      !course.program.name
                        .toLowerCase()
                        .startsWith('Compétition'.toLowerCase()) &&
                      !course.program.name
                        .toLowerCase()
                        .startsWith('Loisirs Perf'.toLowerCase())
                    );
                  });
                }

                this.membersRegisteredThisSeason =
                  coursesResponse[0].userRegistrationsCount;
                switch (coursesResponse[0].userRegistrationsCount) {
                  case 0:
                    this.discount = 0;
                    break;
                  case 1:
                    this.discount = 10;
                    break;
                  default:
                    this.discount = 30;
                }
              },
              error: (err) => {
                this.toastr.error(
                  'Une erreur est survenue, veuillez réessayer ultérieurement',
                  'Erreur'
                );
              },
            });
          },
          error: (err) => {
            this.toastr.error(
              'Une erreur est survenue, veuillez réessayer ultérieurement',
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
  }

  calculateWeeklyDuration(trainingSlots: TrainingSlot[]) {
    return this.calculateDuration.calculateWeeklyDuration(trainingSlots);
  }

  openConfirmationDialog(course: Course) {
    this.selectedCourse = course;
    this.isModalOpen = true;
  }

  onConfirm(courseId: number, coursePrice: number) {
    this.registerCourse(courseId, coursePrice);
    this.isModalOpen = false;
  }

  onClose() {
    this.isModalOpen = false;
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
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });
  }
}
