import { Component, inject } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { ApiService } from '../../../../../shared/services/api.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: User;
  userId!: number;

  apiService = inject(ApiService);
  route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.userId = parseInt(idParam, 10);

        if (!isNaN(this.userId)) {
          this.apiService.getUserById(this.userId).subscribe((user) => {
            this.user = user;
            console.log(this.user);
          });
        } else {
          console.error("ID de l'utilisateur invalide");
        }
      } else {
        console.error("ID de l'utilisateur non trouvé");
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/utilisateurs']);
  }
}
