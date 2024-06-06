import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { phoneFormatValidator } from '../../shared/validators/phone-format.validator';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent {
  imageUrl: string = 'assets/icons/no-image.webp';
  loading: boolean = false;
  relatedOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'grand-parent', label: 'Grand-parent' },
    { value: 'relative', label: 'Tuteur légal' },
    { value: 'other', label: 'Autre' },
  ];

  schools = [
    { value: 'École le carreau', label: 'École le carreau' },
    { value: 'Ecole Condorcet', label: 'Ecole Condorcet' },
    { value: "Ecole Jeanne d'Arc", label: "Ecole Jeanne d'Arc" },
    { value: 'Ecole Les Calabres', label: 'Ecole Les Calabres ' },
    { value: 'Ecole du Sacré Coeur', label: 'Ecole du Sacré Coeur' },
    { value: 'Ecole Jacques Prévert', label: 'Ecole Jacques Prévert' },
    { value: 'Ecole Marcel Pagnol', label: 'Ecole Marcel Pagnol' },
    { value: 'Ecole Marie Curie', label: 'Ecole Marie Curie' },
    { value: 'Ecole du Grand large', label: 'Ecole du Grand large' },
    { value: 'Ecole jules ferry', label: 'Ecole jules ferry' },
    { value: 'Ecole René Cassin', label: 'Ecole René Cassin' },
    { value: 'Collège Olivier de Serres', label: 'Collège Olivier de Serres' },
    { value: 'Collège Olivier de Serres', label: 'Collège Olivier de Serres' },
    { value: 'Lycée Charlie Chaplin', label: 'Lycée Charlie Chaplin' },
    { value: 'GS Privé Al Kindi', label: 'GS Privé Al Kindi' },
    { value: 'Autre', label: 'Autre' },
  ];

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  addMemberForm = this.fb.group({
    gender: ['', Validators.required],
    lastname: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s-]*$/),
      ],
    ],
    firstname: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s-]*$/),
      ],
    ],
    birthday: [null, [Validators.required]],
    school: ['', Validators.required],
    emergencyContacts: this.fb.array([]),
    authorizations: this.fb.group({
      imageUse: [false],
      medicalTreatment: [false],
      leaveGymAlone: [false],
      transport: [false],
      acceptRules: [false, Validators.requiredTrue],
    }),
  });

  get contacts() {
    return this.addMemberForm.get('emergencyContacts') as FormArray;
  }

  addEmergencyContact() {
    const contactGroup = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s-]*$/),
        ],
      ],
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s-]*$/),
        ],
      ],
      relationship: ['', Validators.required],
      phone: [null, [Validators.required, phoneFormatValidator()]],
    });
    this.contacts.push(contactGroup);
  }

  removeEmergencyContact(index: number) {
    this.contacts.removeAt(index);
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'meyzieugym');
      this.http
        .post(
          'https://api.cloudinary.com/v1_1/dz632zpoz/image/upload',
          formData
        )
        .subscribe((response: any) => {
          this.imageUrl = response.secure_url;
          this.loading = false;
        });
    }
  }

  addMember() {
    if (this.addMemberForm.valid) {
      const formData = { ...this.addMemberForm.value, photoUrl: this.imageUrl };
      this.http.post('/users/userId/members', formData).subscribe({
        next: (response) => {
          this.router.navigate(['/questionnaire-medical']);
        },
        error: (err) => {
          console.error('Error adding member:', err);
        },
      });
    }
  }
}
