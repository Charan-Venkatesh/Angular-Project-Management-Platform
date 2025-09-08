import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task, Priority, TaskStatus, Subtask } from '../../../model/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskForm implements OnInit {
  @Input() task?: Task;
  @Input() projectId!: string;
  @Input() sectionId!: string;
  @Input() isEditing = false;
  
  @Output() taskSave = new EventEmitter<Task>();
  @Output() taskCancel = new EventEmitter<void>();

  taskForm: FormGroup;
  priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  statuses: TaskStatus[] = ['todo', 'in-progress', 'completed'];
  subtasks: Subtask[] = [];
  tags: string[] = [];
  newSubtask = '';
  newTag = '';

  constructor(private fb: FormBuilder) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.task) {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium'],
      status: ['todo'],
      startDate: [''],
      dueDate: [''],
      estimatedHours: [0, [Validators.min(0), Validators.max(999)]]
    });
  }

  private populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority || 'medium',
        status: this.task.status,
        startDate: this.task.startDate || '',
        dueDate: this.task.dueDate || ''
      });
      this.subtasks = [...(this.task.subtasks || [])];
      this.tags = [...(this.task.tags || [])];
    }
  }

  addSubtask(): void {
    if (this.newSubtask.trim()) {
      this.subtasks.push({
        id: `subtask-${Date.now()}`,
        title: this.newSubtask.trim(),
        completed: false
      });
      this.newSubtask = '';
    }
  }

  removeSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  toggleSubtask(subtask: Subtask): void {
    subtask.completed = !subtask.completed;
  }

  addTag(): void {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const now = new Date().toISOString();
      
      const taskData: Task = {
        id: this.task?.id || `task-${Date.now()}`,
        title: formValue.title,
        description: formValue.description,
        projectId: this.projectId,
        sectionId: this.sectionId,
        status: formValue.status,
        priority: formValue.priority,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate,
        tags: [...this.tags],
        subtasks: [...this.subtasks],
        completed: formValue.status === 'completed',
        createdAt: this.task?.createdAt || now,
        updatedAt: now,
        position: this.task?.position || 0
      };

      this.taskSave.emit(taskData);
    }
  }

  onCancel(): void {
    this.taskCancel.emit();
  }

  getPriorityIcon(priority: Priority): string {
    const icons = {
      low: '🟢',
      medium: '🟡', 
      high: '🟠',
      urgent: '🔴'
    };
    return icons[priority];
  }

  getSubtaskProgress(): number {
    if (this.subtasks.length === 0) return 0;
    const completed = this.subtasks.filter(s => s.completed).length;
    return (completed / this.subtasks.length) * 100;
  }

  // Getters for template
  get isFormValid() { return this.taskForm.valid; }
  get titleControl() { return this.taskForm.get('title'); }
  get descriptionControl() { return this.taskForm.get('description'); }
}
