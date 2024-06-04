import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../shared/services/address.service';
import { CommonModule } from '@angular/common';
import { phoneFormatValidator } from '../../shared/validators/phone-format.validator';
import { AddressFeature } from '../../models/addressFeature.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  addressSuggestions: any[] = [];
  passwordStrengthClass = 'weak';
  passwordStrengthPercent = 0;
  passwordMessage = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  fb = inject(FormBuilder);
  addressService = inject(AddressService);
  router = inject(Router);

  editProfileForm = this.fb.group({
    lastname: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    firstname: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['', [Validators.required, phoneFormatValidator()]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.loadUserData();
    
    this.editProfileForm.get('address')?.valueChanges.subscribe((value) => {
      if (value && value.length >= 4) {
        this.addressService.searchAddress(value).subscribe((response) => {
          const res = response.features.some((item: AddressFeature) => item.properties.label === value)
          if (!res) {
            this.addressSuggestions = response.features;
          }
        });
      } else {
        this.addressSuggestions = [];
      }
    });


  }

  loadUserData(): void {
    const user = {
      id: 1,
      lastname: 'CHAKIR',
      firstname: 'Amina',
      phone: '0649819299',
      address: '46 rue de la République 69330 Meyzieu',
      email: 'amina.aitm@gmail.com'
    };

    this.editProfileForm.patchValue({
      lastname: user.lastname,
      firstname: user.firstname,
      phone: user.phone,
      address: user.address,
      email: user.email
    });
  }

  selectAddress(address: any): void {
    this.editProfileForm.patchValue({ address: address.properties.label });
    this.addressSuggestions = [];
  }

  goBack() {
    this.router.navigate(['/profil']);
  }

  onSubmit() {
    console.log(this.editProfileForm.value);
  }
}
