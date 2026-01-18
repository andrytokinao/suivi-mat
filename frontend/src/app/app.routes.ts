import { Routes } from '@angular/router';
import {OutgoingDeclarationComponent} from './components/declarations/outgoing-declaration/outgoing-declaration.component';
import {ReturnDeclarationComponent} from './components/declarations/return-declaration/return-declaration.component';
import {DeclarationListComponent} from './components/declarations/declaration-list/declaration-list.component';
import {MaterialListComponent} from './components/materials/material-list/material-list.component';
import {MaterialFormComponent} from './components/materials/material-form/material-form.component';
import {CategoryListComponent} from './components/categories/category-list/category-list.component';
import {CategoryFormComponent} from './components/categories/category-form/category-form.component';
import {ValidationDetailComponent} from './components/admin/validation-detail/validation-detail.component';
import {ValidationListComponent} from './components/admin/validation-list/validation-list.component';


export const routes: Routes = [
  { path: '', redirectTo: '/declarations/outgoing/new', pathMatch: 'full' },
  { path: 'declarations/outgoing/new', component: OutgoingDeclarationComponent },
  { path: 'declarations/return/new', component: ReturnDeclarationComponent },
  { path: 'declarations/list', component: DeclarationListComponent },
  { path: 'materials/list', component: MaterialListComponent },
  { path: 'materials/new', component: MaterialFormComponent },
  { path: 'materials/edit/:id', component: MaterialFormComponent },
  { path: 'categories/list', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'admin/validations', component: ValidationListComponent },
  { path: 'admin/validations/:id', component: ValidationDetailComponent }
];
