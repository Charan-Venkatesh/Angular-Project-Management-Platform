import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'overdue' | 'completed';
  taskId?: string;
  projectId?: string;
  reminder?: {
    enabled: boolean;
    interval: number;
    notified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-deadline-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="deadline-manager">
      <h2>⏰ Deadline Manager - Simple Version</h2>
      <p>Testing basic functionality...</p>
      
      <div class="deadlines-list">
        <div *ngFor="let deadline of deadlines" class="deadline-item">
          <h3>{{ deadline.title }}</h3>
          <p>Due: {{ deadline.dueDate }}</p>
          <p>Status: {{ deadline.status }}</p>
        </div>
        
        <div *ngIf="deadlines.length === 0" class="empty-state">
          <p>No deadlines found. This is working correctly!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .deadline-manager {
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
    }
    
    .deadline-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
    }
    
    .empty-state {
      text-align: center;
      color: #ccc;
      font-style: italic;
    }
  `]
})
export class DeadlineManagerComponent implements OnInit {
  private storageService = inject(StorageService);

  get deadlines(): Deadline[] {
    return this.storageService.deadlines();
  }

  ngOnInit() {
    console.log('DeadlineManagerComponent initialized');
    console.log('Deadlines:', this.deadlines);
  }
}
