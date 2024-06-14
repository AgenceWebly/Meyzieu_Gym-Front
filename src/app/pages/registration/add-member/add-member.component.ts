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
import { phoneFormatValidator } from '../../../shared/validators/phone-format.validator';
import { UploadFileService } from '../../../shared/services/upload-file.service';
import { StorageService } from '../../../shared/services/storage.service';
import { ApiService } from '../../../shared/services/api.service';
import { schools } from '../../../data/schools.data';
import { relationShips } from '../../../data/relationShips.data';

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
  photoError: string = "La photo de l'adhérent est requise";
  currentUserId!: number;

  relatedOptions = relationShips;

  schools = schools;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  fileUploadService = inject(UploadFileService);
  storageService = inject(StorageService);
  apiService = inject(ApiService);

  addMemberForm = this.fb.group({
    profilePictureUrl: [null, Validators.required],
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
    relationToMember: [['', Validators.required]],
    birthdate: [null, [Validators.required]],
    school: ['', Validators.required],
    emergencyContacts: this.fb.array([]),
    authorizations: this.fb.group({
      photoApproved: [false],
      firstAidApproved: [false],
      allowedToLeave: [false],
      transportApproved: [false],
      acceptRules: [false, Validators.requiredTrue],
    }),
  });

  ngOnInit() {
    this.currentUserId = this.storageService.getUser().id;
  }

  get contacts() {
    return this.addMemberForm.get('emergencyContacts') as FormArray;
  }

  addEmergencyContact() {
    const contactGroup = this.fb.group({
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
      relationToMember: ['', Validators.required],
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
        this.addMemberForm
          .get('profilePictureUrl')
          ?.setValue(response.secure_url);
        this.loading = false;
        this.photoError = '';
      });
    }
  }

  addMember() {
    if (this.addMemberForm.valid) {
      const formData = {
        ...this.addMemberForm.value,
        isAllowedToLeave:
          this.addMemberForm.value.authorizations?.allowedToLeave,
        firstAidApproved:
          this.addMemberForm.value.authorizations?.firstAidApproved,
        transportApproved:
          this.addMemberForm.value.authorizations?.transportApproved,
        photoApproved: this.addMemberForm.value.authorizations?.photoApproved,
      };

      this.apiService.createMember(this.currentUserId, formData).subscribe({
        next: (response) => {
          this.router.navigate(['inscription/adherent/' + response + '/cours']);
        },
        error: (err) => {
          console.error('Error adding member:', err);
        },
      });
    }
  }
}
