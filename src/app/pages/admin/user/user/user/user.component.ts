import { Component, inject } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { ApiService } from '../../../../../shared/services/api.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: User;
  userId!: number;

  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.userId = parseInt(idParam, 10);

        if (!isNaN(this.userId)) {
          this.apiService.getUserById(this.userId).subscribe({
            next: (user) => {
              this.user = user;
            },
            error: (err) => {
              this.toastr.error('Erreur : ' + err, 'Erreur');
            },
          });
        } else {
          this.toastr.error("ID de l'utilisateur invalide", 'Erreur');
        }
      } else {
        this.toastr.error("ID de l'utilisateur non trouvé", 'Erreur');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/utilisateurs']);
  }
}
