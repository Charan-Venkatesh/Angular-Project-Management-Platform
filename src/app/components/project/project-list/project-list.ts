import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule here
import { StorageService } from '../../../services/storage.service';
import { Project } from '../../../model/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [FormsModule, CommonModule],  // <-- Include CommonModule here
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent {
  newProjectName = '';
  searchTerm = '';

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  get projects() {
    return this.storageService.projects();
  }

  filteredProjects() {
    const term = this.searchTerm.toLowerCase();
    return this.projects.filter(p => p.name.toLowerCase().includes(term));
  }

  addProject() {
    if (!this.newProjectName.trim()) return; // prevent empty
    this.storageService.addProject({
      id: `${Date.now()}`,
      name: this.newProjectName.trim(),
      completed: false,
      color: '#2196F3',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: []
    } as Project);
    this.newProjectName = '';
  }

  selectProject(project: Project) {
    this.storageService.setCurrentProject(project.id);
    this.router.navigate(['/project', project.id]);
  }

  toggleComplete(project: Project) {
    this.storageService.toggleProjectComplete(project.id);
  }

  deleteProject(project: Project) {
    this.storageService.deleteProject(project.id);
  }
}
