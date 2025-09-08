import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../model/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css']
})
export class TaskCard {
  @Input() task!: Task;
  @Input() isDragging = false;
  
  @Output() taskUpdate = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<string>();
  @Output() dragStart = new EventEmitter<Task>();
  @Output() dragEnd = new EventEmitter<void>();

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.dragStart.emit(this.task);
  }

  onDragEnd(): void {
    this.dragEnd.emit();
  }

  toggleComplete(): void {
    const updatedTask = { ...this.task, completed: !this.task.completed };
    this.taskUpdate.emit(updatedTask);
  }

  deleteTask(): void {
    if (confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskDelete.emit(this.task.id);
    }
  }

  getPriorityColor(): string {
    switch (this.task.priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getPriorityIcon(): string {
    switch (this.task.priority) {
      case 'urgent': return '🔥';
      case 'high': return '⚠️';
      case 'medium': return '📋';
      case 'low': return '📝';
      default: return '📋';
    }
  }
}
