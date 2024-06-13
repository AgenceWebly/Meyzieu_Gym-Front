import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Course } from '../../models/course.model';
import { StorageService } from '../../shared/services/storage.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.scss',
})
export class AddProgramComponent {
  memberId!: number;
  currentUserId!: number;
  discount: number = 30;
  membersRegisteredThisSeason: number = 2;

  courses: Course[] = [
    {
      id: 1,
      trainingSlots: [
        {
          id: 1,
          day: 'lundi',
          startTime: '13:00',
          endTime: '14:00',
        },
        {
          id: 2,
          day: 'vendredi',
          startTime: '13:00',
          endTime: '14:00',
        },
      ],
      program: {
        id: 1,
        name: 'Loisir Performance',
        description:
          "Cours loisirs performance pour s'entrainer à la gymnastique sur différents agrès, que l'on soit un garçon ou une fille",
        includingCompetition: false,
      },
      season: {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      price: 120,
      maxMembers: 12,
      minAge: 8,
      maxAge: 12,
    },
    {
      id: 1,
      trainingSlots: [
        {
          id: 1,
          day: 'lundi',
          startTime: '13:00',
          endTime: '14:00',
        },
        {
          id: 2,
          day: 'vendredi',
          startTime: '13:00',
          endTime: '14:00',
        },
      ],
      program: {
        id: 2,
        name: 'Mini enchainement',
        description:
          "Cours Mini enchainement pour s'entrainer à la gymnastique sur différents agrès, que l'on soit un garçon ou une fille",
        includingCompetition: false,
      },
      season: {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      price: 180,
      maxMembers: 10,
      minAge: 3,
      maxAge: 4,
    },
    {
      id: 3,
      trainingSlots: [
        {
          id: 1,
          day: 'lundi',
          startTime: '13:00',
          endTime: '14:00',
        },
      ],
      program: {
        id: 3,
        name: 'Loisir',
        description:
          "Cours Loisir pour s'entrainer à la gymnastique sur différents agrès, que l'on soit un garçon ou une fille",
        includingCompetition: false,
      },
      season: {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      price: 300,
      maxMembers: 10,
      minAge: 9,
      maxAge: 10,
    },
    {
      id: 4,
      trainingSlots: [
        {
          id: 1,
          day: 'lundi',
          startTime: '13:00',
          endTime: '14:00',
        },
        {
          id: 2,
          day: 'vendredi',
          startTime: '13:00',
          endTime: '14:00',
        },
      ],
      program: {
        id: 3,
        name: 'Loisir',
        description:
          "Cours Loisir pour s'entrainer à la gymnastique sur différents agrès, que l'on soit un garçon ou une fille",
        includingCompetition: false,
      },
      season: {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      price: 300,
      maxMembers: 10,
      minAge: 7,
      maxAge: 8,
    },
    {
      id: 5,
      trainingSlots: [
        {
          id: 1,
          day: 'lundi',
          startTime: '13:00',
          endTime: '14:00',
        },
        {
          id: 2,
          day: 'vendredi',
          startTime: '13:00',
          endTime: '14:00',
        },
      ],
      program: {
        id: 4,
        name: 'Compétition',
        description:
          "Cours compétition pour s'entrainer à la gymnastique sur différents agrès, que l'on soit un garçon ou une fille",
        includingCompetition: true,
      },
      season: {
        id: 1,
        startDate: new Date(),
        endDate: new Date(),
      },
      registrationStartDate: new Date(),
      registrationEndDate: new Date(),
      price: 400,
      maxMembers: 10,
      minAge: 9,
      maxAge: 10,
    },
  ];

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

    this.currentUserId = this.storageService.getUser().id;
    this.apiService.getUserById(this.currentUserId).subscribe((user) => {
      this.calculateDiscount(user);
    });
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
}
