import { Component } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';

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
export class AppComponent {
  title = 'suivimat-app';
}
