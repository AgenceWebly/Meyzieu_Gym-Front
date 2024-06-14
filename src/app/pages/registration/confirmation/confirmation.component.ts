import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  paymentMethod: string | null = null;
  userEmail: string = 'amina.aitm@gmail.com';
  paymentLink: string = 'https://www.helloasso.com/associations/meyzieu-gym-artistique/adhesions/inscription-saison-2024-2025';

  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.paymentMethod = params['paymentMethod'] || null;
    });
  }

  isCardPayment(): boolean {
    return this.paymentMethod === 'cb' || this.paymentMethod === 'cb3x';
  }
}
