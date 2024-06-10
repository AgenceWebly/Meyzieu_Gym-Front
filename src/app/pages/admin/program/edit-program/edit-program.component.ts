import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSwitchModule],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
})
export class EditProgramComponent {
  programId!: number;
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  apiService = inject(ApiService);

  programForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    includingCompetition: [false],
  });

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.programId = parseInt(idParam, 10);

        if (!isNaN(this.programId)) {
          this.apiService
            .getProgramById(this.programId)
            .subscribe((program) => {
              this.programForm.patchValue({
                name: program.name,
                description: program.description,
                includingCompetition: program.includingCompetition,
              });
            });
        } else {
          console.error('ID du cours invalide');
        }
      } else {
        console.error('ID du cours non trouvé');
      }
    });
  }

  submitForm(): void {
    if (this.programForm.valid) {
      this.apiService
        .updateProgram(this.programForm.value, this.programId)
        .subscribe(() => {
          this.router.navigate(['/admin/cours']);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/cours']);
  }
}
