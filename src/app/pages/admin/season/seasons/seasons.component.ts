import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Season } from '../../../../models/season.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent {
  seasons: Season[] = [];

  filteredSeasons: Season[] = [];
  searchYear: string = '';

  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.apiService.getSeasons().subscribe({
      next: (data) => {
        this.seasons = data;
        this.filteredSeasons = data;
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue, veuillez réessayer ultérieurement', 'Erreur');
      },
    });
  }

  editSeason(seasonId: number) {
    this.router.navigate(['/admin/saisons', seasonId]);
  }

  addSeason() {
    this.router.navigate(['/admin/saisons/nouvelle-saison']);
  }

  filterSeasons() {
    if (this.searchYear) {
      this.filteredSeasons = this.seasons.filter((season) => {
        const startDate = new Date(season.startDate);
        const endDate = new Date(season.endDate);
        return (
          startDate.getFullYear().toString() === this.searchYear ||
          endDate.getFullYear().toString() === this.searchYear
        );
      });
    } else {
      this.filteredSeasons = [...this.seasons];
    }
  }
}
