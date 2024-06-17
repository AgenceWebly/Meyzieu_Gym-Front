import { Component, inject } from '@angular/core';
import { Program } from '../../../../models/program.model';
import { ApiService } from '../../../../shared/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
})
export class ProgramsComponent {
  programs: Program[] = [];

  filteredPrograms: Program[] = [];
  searchTerm: string = '';

  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.apiService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
        this.filteredPrograms = data;
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue : ' + err, 'Erreur');
      },
    });
  }

  editProgram(programId: number) {
    this.router.navigate(['/admin/programmes', programId]);
  }

  addProgram() {
    this.router.navigate(['/admin/programmes/nouveau-programme']);
  }

  filterPrograms() {
    if (this.searchTerm) {
      this.filteredPrograms = this.programs.filter((program) =>
        program.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPrograms = [...this.programs];
    }
  }
}
