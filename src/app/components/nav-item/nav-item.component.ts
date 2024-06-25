import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NavItem } from '../../models/navItem.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  roles: string[] = [];
  isVisitor: boolean = true;

  @Input() navItem!: NavItem;
  @Output() dataEmitFromChild: EventEmitter<boolean> = new EventEmitter();

  storageService = inject(StorageService);

  ngOnInit() {
    if (this.storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.isVisitor = false;
    } else {
      this.roles = [];
      this.isVisitor = true;
    }
  }

  hasRole(userType: string): boolean {
    if (userType === 'all') {
      return true;
    }
    if (userType === 'visitorOnly') {
      return this.isVisitor;
    }
    return this.roles.includes(userType);
  }

  closeMenu(): void {
    this.dataEmitFromChild.emit(false);
  }
}
