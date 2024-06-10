import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Season } from '../../../../models/season.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.apiService.getSeasons().subscribe((data) => {
      this.seasons = data;
      this.filteredSeasons = data;
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
