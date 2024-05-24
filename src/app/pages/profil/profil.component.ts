import { Component, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  user: User = {
    lastname: 'CHAKIR',
    firstname: "Amina",
    address: "46 rue de la République 69330 Meyzieu",
    phone: "0649819299",
    email: "amina.aitm@gmail.com",
    rib: "https://res.cloudinary.com/dz632zpoz/image/upload/v1716474314/Bouyguestelecom_Facture_20240323_nso29j.pdf",
  };

  router = inject(Router);


  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }
}
