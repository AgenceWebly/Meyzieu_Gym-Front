import { Component } from '@angular/core';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { NavItem } from '../../models/navItem.model';
import { navItems } from '../../data/navItems.data';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [NavItemComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  navItems: NavItem[] = navItems;
}
