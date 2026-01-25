import { Routes } from '@angular/router';
import { OutgoingDeclarationComponent } from './components/declarations/outgoing-declaration/outgoing-declaration.component';
import { ReturnDeclarationFormComponent } from './components/declarations/return-declaration/return-declaration.component';
import { DeclarationListComponent } from './components/declarations/declaration-list/declaration-list.component';
import { MaterialListComponent } from './components/materials/material-list/material-list.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { ValidationDetailComponent } from './components/admin/validation-detail/validation-detail.component';
import { ValidationListComponent } from './components/admin/validation-list/validation-list.component';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/declarations/list', pathMatch: 'full' },

  // Declarations routes
  {
    path: 'declarations',
    children: [
      { path: 'list', component: DeclarationListComponent },
      { path: 'outgoing/new', component: OutgoingDeclarationComponent },
      { path: 'return/new', component: ReturnDeclarationFormComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },

  // Materials routes
  {
    path: 'materials',
    children: [
      { path: 'list', component: MaterialListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },

  // Categories routes
  {
    path: 'categories',
    children: [
      { path: 'list', component: CategoryListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    children: [
      { path: 'validations', component: ValidationListComponent },
      { path: 'validations/:id', component: ValidationDetailComponent }
    ]
  },

  // Wildcard redirect
  { path: '**', redirectTo: '/declarations/list' }
];
