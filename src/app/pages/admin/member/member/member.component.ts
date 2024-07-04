import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { Member } from '../../../../models/member.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss',
})
export class MemberComponent {
  memberId!: number;
  member!: Member;

  router = inject(Router);
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');

      if (idParam !== null) {
        this.memberId = parseInt(idParam, 10);

        if (!isNaN(this.memberId)) {
          this.apiService.getMemberById(this.memberId).subscribe({
            next: (member) => {
              this.member = member;
              console.log(member);
              
            },
            error: (err) => {
              this.toastr.error(
                'Une erreur est survenue, veuillez réessayer ultérieurement',
                'Erreur'
              );
            },
          });
        } else {
          this.toastr.error('ID du cours invalide', 'Erreur');
        }
      } else {
        this.toastr.error('ID du cours non trouvé', 'Erreur');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/adherents']);
  }
}
