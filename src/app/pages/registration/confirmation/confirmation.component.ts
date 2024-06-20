import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  paymentMethod: string | null = null;
  currentUser!: User;
  paymentLink: string =
    'https://www.helloasso.com/associations/meyzieu-gym-artistique/adhesions/inscription-saison-2024-2025';

  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  storageService = inject(StorageService);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.paymentMethod = params['method'] || null;
    });

    this.currentUser = this.storageService.getUser();
  }

  isCardPayment(): boolean {
    return this.paymentMethod === 'cb' || this.paymentMethod === 'cb3x';
  }
}
