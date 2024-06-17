import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-season',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-season.component.html',
  styleUrl: './edit-season.component.scss',
})
export class EditSeasonComponent {
  seasonId!: number;
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  seasonForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.seasonId = parseInt(idParam, 10);

        if (!isNaN(this.seasonId)) {
          this.apiService.getSeasonById(this.seasonId).subscribe({
            next: (season) => {
              this.seasonForm.patchValue({
                startDate: new Date(season.startDate)
                  .toISOString()
                  .substring(0, 10),
                endDate: new Date(season.endDate)
                  .toISOString()
                  .substring(0, 10),
              });
            },
            error: (err) => {
              this.toastr.error('Erreur : ' + err, 'Erreur');
            },
          });
        } else {
          this.toastr.error('ID de la saison invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID de la saison non trouvé', 'Erreur');
      }
    });
  }

  submitForm(): void {
    if (this.seasonForm.valid) {
      this.apiService
        .updateSeason(this.seasonForm.value, this.seasonId)
        .subscribe({
          next: () => {
            this.toastr.success(
              'La saison a été mise à jour avec succès',
              'Succès'
            );
            this.router.navigate(['/admin/saisons']);
          },
          error: (err) => {
            this.toastr.error('Une erreur est survenue : ' + err, 'Erreur');
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/saisons']);
  }
}
