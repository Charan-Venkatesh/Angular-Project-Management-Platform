import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StorageService } from '../../../services/storage.service';
import { Project, Section } from '../../../model/project.model';
import { Task } from '../../../model/task.model';
import { SectionColumn } from '../../section/section-column/section-column';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, SectionColumn]
})
export class ProjectDetail implements OnInit {
  project: Project | null = null;
  newSectionName = '';
  newTaskTitle: { [sectionId: string]: string } = {};
  editingTaskId: string | null = null;
  editingText: string = '';

  constructor(
    private route: ActivatedRoute,
    public storage: StorageService
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.project = this.storage.projects().find(p => p.id === projectId) || null;
    }
  }

  // ----- Sections -----
  addSection() {
    if (!this.newSectionName.trim() || !this.project) return;
    const newSection: Section = {
      id: `${Date.now()}`,
      name: this.newSectionName.trim(),
      // keep position field if your Section model expects it; otherwise remove
      position: this.project.sections.length,
      color: '#ddd'
    } as unknown as Section;

    this.project.sections.push(newSection);
    // persist project changes (you already have editProject)
    (this.storage as any).editProject
      ? (this.storage as any).editProject(this.project)
      : (this.storage as any).saveProject?.(this.project);
    this.newSectionName = '';
  }

  deleteSection(sectionId: string) {
    if (!this.project) return;

    // delete any tasks attached to the section first
    const tasks = this.storage.getTasksByProject(this.project.id).filter(t => t.sectionId === sectionId);
    for (const t of tasks) {
      // use whatever deleteTask your StorageService exposes; optional chaining avoids TS errors if not present
      (this.storage as any).deleteTask?.(t.id);
    }

    // remove section from project and persist
    this.project.sections = this.project.sections.filter(s => s.id !== sectionId);
    (this.storage as any).editProject
      ? (this.storage as any).editProject(this.project)
      : (this.storage as any).saveProject?.(this.project);
  }

  // ----- Tasks -----
  tasksForSection(sectionId: string): Task[] {
    if (!this.project) return [];
    return this.storage.getTasksByProject(this.project.id).filter(t => t.sectionId === sectionId);
  }

  addTask(sectionId: string) {
    if (!this.project) return;
    const title = this.newTaskTitle[sectionId]?.trim();
    if (!title) return;

    const position = this.tasksForSection(sectionId).length;

    // make sure we include required fields from Task model (status, position, etc.)
    const newTask: Task = {
      id: `${Date.now()}`,
      projectId: this.project.id,
      sectionId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // include model-required fields — adjust the values to match your Task model expectations
      status: 'todo' as any,
      position
    } as unknown as Task;

    // prefer storage.addTask if available
    if ((this.storage as any).addTask) {
      (this.storage as any).addTask(newTask);
    } else {
      // fallback: if tasks are stored inside project (rare), push there and persist project
      // (this is defensive; you can remove if addTask definitely exists)
      (this.project as any).sections = (this.project as any).sections || [];
      (this.storage as any).editProject
        ? (this.storage as any).editProject(this.project)
        : (this.storage as any).saveProject?.(this.project);
    }

    this.newTaskTitle[sectionId] = '';
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    this.saveTask(task);
  }

  deleteTask(task: Task) {
    (this.storage as any).deleteTask?.(task.id);
  }

  startEditing(task: Task) {
    this.editingTaskId = task.id;
    this.editingText = task.title;
  }

  saveEdit(task: Task) {
    if (!this.editingText.trim()) return;
    task.title = this.editingText.trim();
    task.updatedAt = new Date().toISOString();
    this.saveTask(task);
    this.cancelEditing();
  }

  cancelEditing() {
    this.editingTaskId = null;
    this.editingText = '';
  }

  // ----- Bulk Actions -----
  clearCompleted(sectionId: string) {
    const toRemove = this.tasksForSection(sectionId).filter(t => t.completed);
    for (const t of toRemove) {
      (this.storage as any).deleteTask?.(t.id);
    }
  }

  toggleAll(sectionId: string) {
    const tasks = this.tasksForSection(sectionId);
    const allDone = tasks.length > 0 && tasks.every(t => t.completed);
    for (const t of tasks) {
      t.completed = !allDone;
      t.updatedAt = new Date().toISOString();
      this.saveTask(t);
    }
  }

  // ----- Helper: Save/Update task (works even if StorageService lacks updateTask) -----
  private saveTask(task: Task): void {
    const s = this.storage as any;

    // Preferred: call explicit update/edit method if service exposes it
    if (typeof s.updateTask === 'function') {
      s.updateTask(task);
      return;
    }
    if (typeof s.editTask === 'function') {
      s.editTask(task);
      return;
    }

    // Fallback: delete then add (preserves id) — works when service only provides add/delete
    if (typeof s.deleteTask === 'function') s.deleteTask(task.id);
    if (typeof s.addTask === 'function') s.addTask(task);
  }

  // ----- UI Helper Methods -----
  allTasksCompleted(sectionId: string): boolean {
    const tasks = this.tasksForSection(sectionId);
    return tasks.length > 0 && tasks.every(t => t.completed);
  }

  remainingTasksCount(sectionId: string): number {
    return this.tasksForSection(sectionId).filter(t => !t.completed).length;
  }

  // ----- Drag & Drop Methods -----
  onTaskMove(event: {taskId: string, newSectionId: string}): void {
    const task = this.storage.tasks().find(t => t.id === event.taskId);
    if (task && task.sectionId !== event.newSectionId) {
      const updatedTask = { ...task, sectionId: event.newSectionId };
      this.saveTask(updatedTask);
    }
  }

  onTaskUpdate(task: Task): void {
    this.saveTask(task);
  }

  onTaskDelete(taskId: string): void {
    this.storage.deleteTask(taskId);
  }

  onTaskAdd(sectionId: string): void {
    if (!this.project) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      projectId: this.project.id,
      sectionId,
      status: 'todo',
      completed: false,
      position: this.tasksForSection(sectionId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.storage.addTask(newTask);
    // Start editing the new task immediately
    this.startEditing(newTask);
  }

  trackBySection(index: number, section: Section): string {
    return section.id;
  }
}
