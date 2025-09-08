import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCard } from '../../task/task-card/task-card';
import { Task } from '../../../model/task.model';
import { Section } from '../../../model/project.model';

@Component({
  selector: 'app-section-column',
  standalone: true,
  imports: [CommonModule, TaskCard],
  templateUrl: './section-column.html',
  styleUrls: ['./section-column.css']
})
export class SectionColumn {
  @Input() section!: Section;
  @Input() tasks: Task[] = [];
  @Input() isDragOver = false;
  
  @Output() taskUpdate = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<string>();
  @Output() taskMove = new EventEmitter<{taskId: string, newSectionId: string}>();
  @Output() taskAdd = new EventEmitter<string>();

  draggedTask: Task | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (!event.relatedTarget || !target.contains(event.relatedTarget as Node)) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId && taskId !== this.section.id) {
      this.taskMove.emit({ taskId, newSectionId: this.section.id });
    }
  }

  onTaskDragStart(task: Task): void {
    this.draggedTask = task;
  }

  onTaskDragEnd(): void {
    this.draggedTask = null;
  }

  onTaskUpdate(task: Task): void {
    this.taskUpdate.emit(task);
  }

  onTaskDelete(taskId: string): void {
    this.taskDelete.emit(taskId);
  }

  addNewTask(): void {
    this.taskAdd.emit(this.section.id);
  }

  getTaskCount(): number {
    return this.tasks.length;
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
