import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    SidebarComponent,
    NgbModule
  ]
})
export class AppComponent implements OnInit {
  isSidebarCollapsed = false;
  isSidebarOpen = false;
  currentRoute = 'Accueil';
  isMobile = false;

  private routeMap: { [key: string]: string } = {
    '/': 'Accueil',
    '/declarations': 'Déclarations',
    '/declarations/outgoing/new': 'Nouvelle Sortie',
    '/declarations/return/new': 'Nouveau Retour',
    '/declarations/list': 'Liste des Déclarations',
    '/materials': 'Matériels',
    '/materials/list': 'Liste des Matériels',
    '/categories': 'Catégories',
    '/categories/list': 'Liste des Catégories',
    '/admin': 'Administration',
    '/admin/validations': 'Validations en Attente'
  };

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateCurrentRoute(event.url);
      });

    this.updateCurrentRoute(this.router.url);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.toggleBodyScroll();
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  private toggleBodyScroll(): void {
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  private updateCurrentRoute(url: string): void {
    // Try exact match first
    if (this.routeMap[url]) {
      this.currentRoute = this.routeMap[url];
      return;
    }

    // Try partial match
    const matchedRoute = Object.keys(this.routeMap).find(route =>
      url.startsWith(route) && route !== '/'
    );

    this.currentRoute = matchedRoute ? this.routeMap[matchedRoute] : 'Page';
  }
}
