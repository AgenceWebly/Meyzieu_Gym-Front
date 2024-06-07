import { Component, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { UploadFileService } from '../../shared/services/upload-file.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {

  currentUser: any;
  loading: boolean = false;
  messageError = '';

  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);
  uploadFileService = inject(UploadFileService);

  ngOnInit(): void {
    const currentUserId = this.storageService.getUser().id;
    this.apiService.getCurrentUserDataFromApi(currentUserId).subscribe({
      next: (data) => {
        this.currentUser = data;
      },
      error: (err) => {
        this.messageError = err;
        console.log(err.message);
      },
    });
  }

  editProfile(): void {
    this.router.navigate(['/profil/edit']);
  }

  handleRibUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      this.uploadFileService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.currentUser = { ...this.currentUser, rib: response.secure_url };
          
          // this.apiService.updateUser(this.currentUser, this.currentUser.id).subscribe({
          //   next: () => {
          //     this.loading = false;
          //     //this.router.navigate(['/profile']);
          //   },
          //   error: (err) => {
          //     console.error('Error updating user:', err);
          //     this.loading = false;
          //   }
          // });
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.loading = false;
        }
      });
    }
  }
}
