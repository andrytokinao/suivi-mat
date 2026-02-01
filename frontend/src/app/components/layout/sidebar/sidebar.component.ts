import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: number;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-out')
      ])
    ])
  ]
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Tableau de Bord',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Déclarations',
      icon: 'assignment',
      children: [
        { label: 'Liste des Déclarations', icon: 'list_alt', route: '/declarations/list' },
        { label: 'Nouvelle Sortie', icon: 'upload', route: '/declarations/outgoing/new' },
        { label: 'Nouveau Retour', icon: 'download', route: '/declarations/return/new' }
      ]
    },
    {
      label: 'Matériels',
      icon: 'inventory_2',
      children: [
        { label: 'Liste des Matériels', icon: 'view_list', route: '/materials/list' }
      ]
    },
    {
      label: 'Catégories',
      icon: 'category',
      children: [
        { label: 'Liste des Catégories', icon: 'folder', route: '/categories/list' }
      ]
    },
    {
      label: 'Administration',
      icon: 'admin_panel_settings',
      children: [
        { label: 'Validations en Attente', icon: 'pending_actions', route: '/admin/validations' }
      ]
    }
  ];

  expandedItems: Set<string> = new Set();

  constructor(private router: Router) {
    // Expand first expandable menu item by default
    const firstExpandable = this.menuItems.find(item => item.children && item.children.length > 0);
    if (firstExpandable) {
      this.expandedItems.add(firstExpandable.label);
    }
  }

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

  navigate(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children && item.children.length > 0;
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.isActiveRoute(child.route));
  }
}
