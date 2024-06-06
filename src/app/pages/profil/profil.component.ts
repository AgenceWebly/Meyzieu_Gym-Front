import { Component, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {
  userTest: User = {
    id: 1,
    lastname: 'CHAKIR',
    firstname: 'Amina',
    address: '46 rue de la République 69330 Meyzieu',
    phone: '0649819299',
    email: 'amina.aitm@gmail.com',
    occupation: 'Formatrice',
    rib: '',
  };

  currentUser: any;
  messageError = '';

  router = inject(Router);
  storageService = inject(StorageService);
  apiService = inject(ApiService);

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

  onUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vous pouvez gérer le téléchargement du fichier
      console.log('File uploaded:', file);
      // Mettre à jour l'utilisateur avec le lien vers le fichier RIB téléchargé
      //this.user.rib = URL.createObjectURL(file); // Remplacez par votre logique pour obtenir l'URL du fichier
    }
  }
}
