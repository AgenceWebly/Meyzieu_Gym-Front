import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UploadFileService } from '../../shared/services/upload-file.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
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
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);

        if (!isNaN(this.memberId)) {
          this.apiService.getMemberDetails(this.memberId).subscribe({
            next: (memberDetails) => {
              this.memberDetails = memberDetails;
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

  handleCertificateUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.uploadFileService.uploadFile(file).subscribe({
        next: (response: any) => {
          this.memberDetails = {
            ...this.memberDetails,
            sportPassUrl: response.secure_url,
          };
          this.apiService
            .updateMember(this.memberDetails.id, this.memberDetails)
            .subscribe({
              next: () => {
                this.isUploading = false;
                this.toastr.success(
                  'Attestation téléchargée avec succès',
                  'Succès'
                );
              },
              error: (err) => {
                console.error('Error updating user:', err);
                this.isUploading = false;
                this.toastr.error(
                  "Erreur lors de la mise à jour de l'attestation"
                );
              },
            });
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading = false;
          this.toastr.error('Échec du téléchargement du fichier', 'Erreur');
        },
      });
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.addImage('assets/icons/logo.jpg', 'JPEG', 0, 0, 50, 50);

    doc.setFontSize(22);
    doc.text('Attestation de cotisation', 70, 30);

    doc.setFontSize(12);
    doc.text('Je soussignée, Sandrine COPONAT,', 20, 70);

    doc.setFontSize(12);
    doc.text(
      'agissant en tant que Présidente du club Meyzieu Gym Artisique,',
      20,
      80
    );

    doc.setFontSize(12);
    doc.text('atteste par la présente que :', 20, 90);

    doc.setFontSize(12);
    doc.text(
      this.memberDetails.guardians[0].lastname +
        ' ' +
        this.memberDetails.guardians[0].firstname,
      70,
      110
    );

    doc.setFontSize(12);
    doc.text(
      '- a bien inscrit son enfant au sein de Meyzieu Gym Artistique pour la saison 2024/2025 :',
      20,
      130
    );

    doc.text(
      this.memberDetails.firstname + ' ' + this.memberDetails.lastname,
      70,
      150
    );

    doc.text(
      '- a réglé la cotisation demandée pour valider cette inscription',
      20,
      170
    );

    doc.text(
      '- pour un montant de ' +
        this.memberDetails.registrations[0].registrationFee +
        ' Euros.',
      20,
      180
    );

    doc.text(
      'Cette attestation a été établie pour servir et valoir ce que de droit.',
      20,
      210
    );

    doc.text('Fait à Meyzieu, le 30/09/2024', 20, 220);

    doc.addImage('assets/icons/tampon.jpg', 'JPEG', 30, 225, 50, 50);

    doc.setFontSize(9).setTextColor(211, 211, 211);
    doc.text('Gymnase du Carreau', 20, 278);

    doc.text('41 chemin de Pommier', 20, 282);

    doc.text('69330  MEYZIEU', 20, 286);

    doc.text('SIRET 883 788 648 00011', 20, 290);

    doc.text('secretariatmeyzieugym@gmail.com', 150, 286);

    doc.text('meyzieugym.e-monsite.com', 150, 290);

    // Save the PDF.
    doc.output('dataurlnewwindow');
    //doc.save('table.pdf');
  }
}
