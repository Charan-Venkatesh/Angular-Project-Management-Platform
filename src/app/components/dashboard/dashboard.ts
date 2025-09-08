import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Project } from '../../model/project.model';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(
    public storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Dashboard initializes with current data
  }

  // Analytics
  get totalProjects(): number {
    return this.storage.projects().length;
  }

  get activeProjects(): number {
    return this.storage.projects().filter(p => !p.completed).length;
  }

  get completedProjects(): number {
    return this.storage.projects().filter(p => p.completed).length;
  }

  get totalTasks(): number {
    return this.storage.tasks().length;
  }

  get activeTasks(): number {
    return this.storage.tasks().filter(t => !t.completed).length;
  }

  get completedTasks(): number {
    return this.storage.tasks().filter(t => t.completed).length;
  }

  get overdueTasks(): number {
    const now = new Date().toISOString().split('T')[0];
    return this.storage.tasks().filter(t => 
      t.dueDate && t.dueDate < now && !t.completed
    ).length;
  }

  get urgentTasks(): number {
    return this.storage.tasks().filter(t => 
      t.priority === 'urgent' && !t.completed
    ).length;
  }

  get completionRate(): number {
    if (this.totalTasks === 0) return 0;
    return (this.completedTasks / this.totalTasks) * 100;
  }

  get projectProgress(): {project: Project, progress: number}[] {
    return this.storage.projects().map(project => {
      const tasks = this.storage.getTasksByProject(project.id);
      const completed = tasks.filter(t => t.completed).length;
      const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
      return { project, progress };
    });
  }

  get recentTasks(): Task[] {
    return [...this.storage.tasks()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }

  get upcomingTasks(): Task[] {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.storage.tasks()
      .filter(t => t.dueDate && !t.completed)
      .filter(t => {
        const dueDate = new Date(t.dueDate!);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  }

  get tasksByPriority() {
    const tasks = this.storage.tasks().filter(t => !t.completed);
    return {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  getPriorityColor(priority?: string): string {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getPriorityIcon(priority?: string): string {
    switch (priority) {
      case 'urgent': return '🔥';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return '📝';
      default: return '📄';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'todo': return '⏳';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      default: return '📄';
    }
  }
}
