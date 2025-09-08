import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/project/project-list/project-list';
import { ProjectDetail } from './components/project/project-detail/project-detail';
import { TodoComponent } from './components/todo/todo';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'project/:id', component: ProjectDetail },
  { path: 'todo', component: TodoComponent },
  { path: '**', redirectTo: '/dashboard' }
];
