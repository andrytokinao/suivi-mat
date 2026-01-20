import { Component, OnInit, HostListener } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import { filter } from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from './components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true,
  imports: [
    FormsModule,
    RouterOutlet,
    SidebarComponent
  ],
})
export class AppComponent implements OnInit {
  isSidebarCollapsed = false;
  isSidebarOpen = false;
  currentRoute = 'Dashboard';
  hasNotifications = true;
  isMobile = false;

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Écouter les changements de route pour mettre à jour le breadcrumb
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentRoute(event.url);
      });

    // Initialiser le breadcrumb
    this.updateCurrentRoute(this.router.url);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;

    // Fermer automatiquement la sidebar sur mobile
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      // Sur mobile, toggle l'overlay
      this.isSidebarOpen = !this.isSidebarOpen;
      this.toggleBodyScroll();
    } else {
      // Sur desktop, collapse/expand
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
    // Mapper les URLs aux noms de routes
    const routeMap: { [key: string]: string } = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/materials': 'Matériels',
      '/categories': 'Catégories',
      '/users': 'Utilisateurs',
      '/settings': 'Paramètres',
      '/reports': 'Rapports',
      '/inventory': 'Inventaire',
      '/analytics': 'Analytique'
    };

    // Trouver la route correspondante
    const matchedRoute = Object.keys(routeMap).find(route =>
      url.startsWith(route) && route !== '/'
    ) || '/';

    this.currentRoute = routeMap[matchedRoute] || 'Page';
  }

  // Méthode pour gérer les notifications (exemple)
  onNotificationClick(): void {
    console.log('Notifications clicked');
    // Implémenter la logique des notifications
  }

  // Méthode pour gérer le profil utilisateur (exemple)
  onUserProfileClick(): void {
    console.log('User profile clicked');
    // Implémenter la logique du menu utilisateur
  }
}
