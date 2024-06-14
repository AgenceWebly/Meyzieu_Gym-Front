import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-season',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-season.component.html',
  styleUrl: './create-season.component.scss',
})
export class CreateSeasonComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  seasonForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor() {}

  submitForm() {
    if (this.seasonForm.valid) {
      this.apiService.createSeason(this.seasonForm.value).subscribe({
        next: () => {
          this.toastr.success('La saison a été créée avec succès', 'Succès');
          this.router.navigate(['/admin/saisons']);
        },
        error: (err) => {
          this.toastr.error('Une erreur est survenue : ' + err, 'Erreur');
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/saisons']);
  }
}
