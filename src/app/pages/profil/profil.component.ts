import { Component, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {
  user: User = {
    id: 1,
    lastname: 'CHAKIR',
    firstname: 'Amina',
    address: '46 rue de la République 69330 Meyzieu',
    phone: '0649819299',
    email: 'amina.aitm@gmail.com',
    rib: '',
  };

  router = inject(Router);

  editProfile(): void {
    this.router.navigate(['/profil/edit']);
  }

  onUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vous pouvez gérer le téléchargement du fichier ici
      console.log('File uploaded:', file);
      // Mettre à jour l'utilisateur avec le lien vers le fichier RIB téléchargé
      //this.user.rib = URL.createObjectURL(file); // Remplacez par votre logique pour obtenir l'URL du fichier
    }
  }
}
