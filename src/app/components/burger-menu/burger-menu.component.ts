import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavItem } from '../../models/navItem.model';
import { navItems } from '../../data/navItems.data';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [CommonModule, NavItemComponent],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',
})
export class BurgerMenuComponent {
  navItems: NavItem[] = navItems;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  dataReceiveFromChild(data: boolean) {
    this.isMenuOpen = data;
  }
}
