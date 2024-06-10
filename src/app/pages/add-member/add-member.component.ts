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
import { UploadFileService } from '../../shared/services/upload-file.service';

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
  photoError: string = 'La photo de l\'adhérent est requise';

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
  fileUploadService = inject(UploadFileService);

  addMemberForm = this.fb.group({
    photoUrl: [null, Validators.required],
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
      phoneNumber: [null, [Validators.required, phoneFormatValidator()]],
    });
    this.contacts.push(contactGroup);
  }

  removeEmergencyContact(index: number) {
    this.contacts.removeAt(index);
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      this.fileUploadService.uploadFile(file).subscribe((response: any) => {
        this.imageUrl = response.secure_url;
        this.addMemberForm.get('photoUrl')?.setValue(response.secure_url);
        this.loading = false;
        this.photoError = '';
      });
    }
  }

  addMember() {
    if (this.addMemberForm.valid) {
      const formData = { ...this.addMemberForm.value};
      this.http.post('/users/userId/members', formData).subscribe({
        next: (response) => {
          console.log(response);
          const memberId = 1;
          this.router.navigate(['inscription/cours?member=' + '1']);
        },
        error: (err) => {
          console.error('Error adding member:', err);
        },
      });
    }
  }
}
