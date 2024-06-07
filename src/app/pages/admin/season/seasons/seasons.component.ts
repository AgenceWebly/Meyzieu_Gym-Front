import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Season } from '../../../../models/season.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent {
  seasons: Season[] = [
    {
      id: 1,
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-08-31'),
    },
    {
      id: 2,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
    },
  ];

  filteredSeasons: Season[] = [...this.seasons];
  searchYear: string = '';

  constructor(private router: Router) {}

  editSeason(seasonId: number) {
    this.router.navigate(['/saisons', seasonId]);
  }

  addSeason() {
    this.router.navigate(['/saisons/créer']);
  }

  filterSeasons() {
    if (this.searchYear) {
      this.filteredSeasons = this.seasons.filter(season => 
        season.startDate.getFullYear().toString() === this.searchYear ||
        season.endDate.getFullYear().toString() === this.searchYear
      );
    } else {
      this.filteredSeasons = [...this.seasons];
    }
  }
}
