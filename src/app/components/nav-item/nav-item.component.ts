import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from '../../models/navItem.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class NavItemComponent {
  @Input() navItem!: NavItem;
  @Output() dataEmitFromChild: EventEmitter<boolean> = new EventEmitter();

  closeMenu(): void {
    this.dataEmitFromChild.emit(false);
  }
}
