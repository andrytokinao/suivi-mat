import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgFor, NgIf} from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [NgFor,NgIf],
  standalone:true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Déclarations',
      icon: 'file-text',
      route: '/declarations',
      children: [
        { label: 'Nouvelle Sortie', icon: 'arrow-up-circle', route: '/declarations/outgoing/new' },
        { label: 'Nouveau Retour', icon: 'arrow-down-circle', route: '/declarations/return/new' },
        { label: 'Mes Déclarations', icon: 'list', route: '/declarations/list' }
      ]
    },
    {
      label: 'Administration',
      icon: 'shield',
      route: '/admin',
      children: [
        { label: 'Validations', icon: 'check-circle', route: '/admin/validations' }
      ]
    },
    {
      label: 'Matériels',
      icon: 'package',
      route: '/materials',
      children: [
        { label: 'Liste', icon: 'list', route: '/materials/list' },
        { label: 'Nouveau', icon: 'plus', route: '/materials/new' }
      ]
    },
    {
      label: 'Catégories',
      icon: 'folder',
      route: '/categories',
      children: [
        { label: 'Liste', icon: 'list', route: '/categories/list' },
        { label: 'Nouvelle', icon: 'plus', route: '/categories/new' }
      ]
    }
  ];

  expandedItems: Set<string> = new Set();

  constructor(private router: Router) {}

  toggleExpand(label: string): void {
    if (this.expandedItems.has(label)) {
      this.expandedItems.delete(label);
    } else {
      this.expandedItems.add(label);
    }
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
