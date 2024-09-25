import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormUtilityService } from '../../../../shared/services/form-utility.service';

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
  toastr = inject(ToastrService);
  formUtilityService = inject(FormUtilityService);

  programForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    ],
    includingCompetition: [false],
  });

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.programId = parseInt(idParam, 10);

        if (!isNaN(this.programId)) {
          this.apiService.getProgramById(this.programId).subscribe({
            next: (program) => {
              this.programForm.patchValue({
                name: program.name,
                description: program.description,
                includingCompetition: program.includingCompetition,
              });
            },
            error: (err) => {
              this.toastr.error(
                'Une erreur est survenue, veuillez réessayer ultérieurement',
                'Erreur'
              );
            },
          });
        } else {
          this.toastr.error('ID du programme invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID du programme non trouvé', 'Erreur');
      }
    });
  }

  submitForm(): void {
    if (this.programForm.valid) {
      const trimmedFormValues = this.formUtilityService.trimFormValues(this.programForm);

      this.apiService
        .updateProgram(trimmedFormValues, this.programId)
        .subscribe({
          next: () => {
            this.toastr.success('Programme mis à jour avec succès', 'Succès');
            this.router.navigate(['/admin/programmes']);
          },
          error: (err) => {
            this.toastr.error(
              'Une erreur est survenue, veuillez réessayer ultérieurement',
              'Erreur'
            );
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/programmes']);
  }
}
