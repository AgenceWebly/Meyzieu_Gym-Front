import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../shared/services/address.service';
import { CommonModule } from '@angular/common';
import { phoneFormatValidator } from '../../shared/validators/phone-format.validator';
import { AddressFeature } from '../../models/addressFeature.model';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  currentUserId!: number;

  fb = inject(FormBuilder);
  addressService = inject(AddressService);
  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  editProfileForm = this.fb.group({
    lastname: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s-]*$/),
      ],
    ],
    firstname: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s-]*$/),
      ],
    ],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phoneNumber: ['', [Validators.required, phoneFormatValidator()]],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    occupation: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.currentUserId = this.storageService.getUser().id;
    this.apiService.getCurrentUserDataFromApi(this.currentUserId).subscribe({
      next: (user) => {
        this.editProfileForm.patchValue({
          lastname: user.lastname,
          firstname: user.firstname,
          phoneNumber: user.phoneNumber,
          address: user.address,
          email: user.email,
          occupation: user.occupation,
        });
      },
      error: (err) => {
        this.toastr.error(
          'Une erreur est survenue, veuillez réessayer ultérieurement',
          'Erreur'
        );
      },
    });
  }

  goBack() {
    this.router.navigate(['/profil']);
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      this.apiService
        .updateUser(this.editProfileForm.value, this.currentUserId)
        .subscribe({
          next: () => {
            this.toastr.success('Profil mis à jour avec succès', 'Succès');
            this.router.navigate(['/profil']);
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
}
