import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class TodoComponent implements OnInit {
  newTask: string = '';
  tasks: Task[] = [];
  filter: FilterType = 'all';
  editingTaskId: number | null = null;
  editingText: string = '';
  showError: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  addTask(): void {
    const title = this.newTask.trim();
    if (!title) return this.showValidationError('Please enter a task description');
    if (title.length < 3) return this.showValidationError('Task must be at least 3 characters long');
    if (this.tasks.some(t => t.title.toLowerCase() === title.toLowerCase())) {
      return this.showValidationError('This task already exists');
    }

    this.tasks.push({ id: Date.now(), title, completed: false, createdAt: new Date() });
    this.newTask = '';
    this.saveTasks();
    this.clearError();
  }

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editingText = task.title;
  }

  cancelEditing(): void {
    this.editingTaskId = null;
    this.editingText = '';
  }

  saveEdit(): void {
    if (this.editingTaskId !== null && this.editingText.trim()) {
      const task = this.tasks.find(t => t.id === this.editingTaskId);
      if (task) {
        task.title = this.editingText.trim();
        this.saveTasks();
      }
    }
    this.cancelEditing();
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveTasks();
  }

  toggleAllTasks(): void {
    const allCompleted = this.tasks.every(t => t.completed);
    this.tasks.forEach(t => (t.completed = !allCompleted));
    this.saveTasks();
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'active') return this.tasks.filter(t => !t.completed);
    if (this.filter === 'completed') return this.tasks.filter(t => t.completed);
    return this.tasks;
  }

  get remainingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get hasCompletedTasks(): boolean {
    return this.tasks.some(t => t.completed);
  }

  get allTasksCompleted(): boolean {
    return this.tasks.length > 0 && this.tasks.every(t => t.completed);
  }

  setFilter(filter: FilterType): void {
    this.filter = filter;
  }

  private loadTasks(): void {
    const saved = localStorage.getItem('angular-todo-tasks');
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch {
        this.tasks = [];
      }
    }
  }

  private saveTasks(): void {
    localStorage.setItem('angular-todo-tasks', JSON.stringify(this.tasks));
  }

  private showValidationError(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => this.clearError(), 3000);
  }

  private clearError(): void {
    this.showError = false;
    this.errorMessage = '';
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && this.newTask.trim()) {
      this.addTask();
    }
    if (event.key === 'Escape' && this.editingTaskId !== null) {
      this.cancelEditing();
    }
  }
}
