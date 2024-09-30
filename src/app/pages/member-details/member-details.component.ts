import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UploadFileService } from '../../shared/services/upload-file.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss'
})
export class MemberDetailsComponent {
  currentUser: any;
  memberId!: number;
  memberDetails: any;

  loading: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;

  router = inject(Router);
  route = inject(ActivatedRoute);
  storageService = inject(StorageService);
  apiService = inject(ApiService);
  uploadFileService = inject(UploadFileService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    const currentUserId = this.storageService.getUser().id;

    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);

        if (!isNaN(this.memberId)) {
          this.apiService.getMemberDetails(this.memberId).subscribe({
            next: (memberDetails) => {
              this.memberDetails = memberDetails;
              console.log(memberDetails);
              
            },
            error: (err) => {
              this.toastr.error(
                'Une erreur est survenue, veuillez réessayer ultérieurement',
                'Erreur'
              );
            },
          });
        } else {
          this.toastr.error('ID du membre invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID du membre non trouvé', 'Erreur');
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/profil/edit']);
  }

  handleCertificateUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.uploadFileService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.currentUser = {
            ...this.currentUser,
            sportPassUrl: response.secure_url,
          };
          // this.apiService
          //   .updateMember(this.currentMember, this.currentMember.id)
          //   .subscribe({
          //     next: () => {
          //       this.isUploading = false;
          //       this.toastr.success('Attestation téléchargée avec succès', 'Succès');
          //     },
          //     error: (err) => {
          //       console.error('Error updating user:', err);
          //       this.isUploading = false;
          //       this.toastr.error('Erreur lors de la mise à jour de l\'attestation');
          //     },
          //   });
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading = false;
          this.toastr.error('Échec du téléchargement du fichier', 'Erreur');
        },
      });
    }
  }
}
