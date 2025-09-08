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
      <div class="header">
        <h2>⏰ Deadline Manager</h2>
        <button class="btn-primary" (click)="toggleAddForm()">
          {{ showAddForm ? '❌ Cancel' : '➕ Add Deadline' }}
        </button>
      </div>

      <!-- Add Form -->
      <div class="add-form" *ngIf="showAddForm">
        <div class="form-row">
          <input 
            type="text" 
            [(ngModel)]="newDeadline.title" 
            placeholder="Deadline title..."
            class="form-input"
          />
          <input 
            type="date" 
            [(ngModel)]="newDeadline.dueDate"
            class="form-input"
          />
          <select [(ngModel)]="newDeadline.priority" class="form-input">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
          <button class="btn-success" (click)="addDeadline()">Add</button>
          <button class="btn-cancel" (click)="cancelAdd()">Cancel</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <button 
          *ngFor="let filter of filters" 
          class="filter-btn"
          [class.active]="activeFilter === filter.value"
          (click)="setFilter(filter.value)">
          {{ filter.label }}
        </button>
      </div>

      <!-- Deadlines List -->
      <div class="deadlines-list">
        <div 
          *ngFor="let deadline of getFilteredDeadlines()" 
          class="deadline-item"
          [class.overdue]="isOverdue(deadline)"
          [class.urgent]="deadline.priority === 'urgent'"
          [class.completed]="deadline.status === 'completed'">
          
          <div class="deadline-content">
            <h4>{{ deadline.title }}</h4>
            <div class="deadline-meta">
              <span class="due-date">📅 {{ formatDate(deadline.dueDate) }}</span>
              <span class="priority priority-{{ deadline.priority }}">{{ getPriorityIcon(deadline.priority) }}</span>
              <span class="status">{{ deadline.status }}</span>
            </div>
          </div>
          
          <div class="actions">
            <button 
              class="action-btn complete-btn" 
              (click)="toggleComplete(deadline)">
              {{ deadline.status === 'completed' ? '↩️' : '✅' }}
            </button>
            <button 
              class="action-btn edit-btn" 
              (click)="editDeadline(deadline)">
              ✏️
            </button>
            <button 
              class="action-btn delete-btn" 
              (click)="removeDeadline(deadline.id)">
              🗑️
            </button>
          </div>
        </div>

        <div class="empty-state" *ngIf="getFilteredDeadlines().length === 0">
          <div class="empty-icon">⏰</div>
          <h3>No deadlines found</h3>
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="quick-btn" (click)="addQuickDeadline('today')">📅 Due Today</button>
        <button class="quick-btn" (click)="addQuickDeadline('tomorrow')">🌅 Due Tomorrow</button>
        <button class="quick-btn" (click)="addQuickDeadline('week')">📆 Due This Week</button>
        <button class="quick-btn" (click)="clearCompleted()">🧹 Clear Completed</button>
      </div>
    </div>
  `,
  styles: [`
    .deadline-manager {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      color: white;
      margin: 0;
      font-size: 1.8rem;
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .btn-primary, .btn-success, .btn-cancel {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-success {
      background: linear-gradient(45deg, #4caf50, #45a049);
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-primary:hover, .btn-success:hover, .btn-cancel:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .add-form {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 15px;
      margin-bottom: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto auto;
      gap: 1rem;
      align-items: center;
    }

    .form-input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn.active {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      color: #333;
      font-weight: 600;
    }

    .deadlines-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .deadline-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .deadline-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .deadline-item.overdue {
      border-left: 4px solid #ff4444;
      background: rgba(255, 68, 68, 0.1);
    }

    .deadline-item.urgent {
      border-left: 4px solid #ff9800;
      background: rgba(255, 152, 0, 0.1);
    }

    .deadline-item.completed {
      opacity: 0.7;
      background: rgba(76, 175, 80, 0.1);
    }

    .deadline-content {
      flex: 1;
    }

    .deadline-content h4 {
      color: white;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .deadline-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .due-date {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }

    .priority {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .priority-low {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }

    .priority-medium {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .priority-high {
      background: rgba(255, 152, 0, 0.2);
      color: #ff9800;
    }

    .priority-urgent {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
    }

    .status {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .complete-btn:hover {
      background: rgba(76, 175, 80, 0.3);
    }

    .edit-btn:hover {
      background: rgba(255, 193, 7, 0.3);
    }

    .delete-btn:hover {
      background: rgba(244, 67, 54, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .quick-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .quick-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .deadline-manager {
        padding: 1rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .filters {
        justify-content: center;
      }
      
      .deadline-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .quick-actions {
        justify-content: center;
      }
    }
  `]
})
export class DeadlineManagerComponent implements OnInit {
  private storageService = inject(StorageService);
  
  showAddForm = false;
  activeFilter: 'all' | 'active' | 'overdue' | 'completed' = 'all';

  newDeadline: Partial<Deadline> = {
    title: '',
    dueDate: '',
    priority: 'medium'
  };

  filters = [
    { value: 'all' as const, label: '📋 All' },
    { value: 'active' as const, label: '⏳ Active' },
    { value: 'overdue' as const, label: '🔥 Overdue' },
    { value: 'completed' as const, label: '✅ Completed' }
  ];

  get deadlines(): Deadline[] {
    return this.storageService.deadlines();
  }

  ngOnInit() {
    // Component initialization
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.resetNewDeadline();
    }
  }

  resetNewDeadline() {
    this.newDeadline = {
      title: '',
      dueDate: '',
      priority: 'medium'
    };
  }

  addDeadline() {
    if (!this.newDeadline.title || !this.newDeadline.dueDate) {
      alert('Please fill in title and due date');
      return;
    }

    const deadline: Deadline = {
      id: `deadline-${Date.now()}`,
      title: this.newDeadline.title,
      dueDate: this.newDeadline.dueDate,
      priority: this.newDeadline.priority || 'medium',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.storageService.addDeadline(deadline);
    this.showAddForm = false;
    this.resetNewDeadline();
  }

  cancelAdd() {
    this.showAddForm = false;
    this.resetNewDeadline();
  }

  removeDeadline(id: string) {
    if (confirm('Are you sure you want to delete this deadline?')) {
      this.storageService.removeDeadline(id);
    }
  }

  toggleComplete(deadline: Deadline) {
    const updatedDeadline = {
      ...deadline,
      status: deadline.status === 'completed' ? 'active' : 'completed' as 'active' | 'completed',
      updatedAt: new Date().toISOString()
    };
    this.storageService.updateDeadline(updatedDeadline);
  }

  editDeadline(deadline: Deadline) {
    const newTitle = prompt('Edit deadline title:', deadline.title);
    if (newTitle && newTitle !== deadline.title) {
      const updatedDeadline = {
        ...deadline,
        title: newTitle,
        updatedAt: new Date().toISOString()
      };
      this.storageService.updateDeadline(updatedDeadline);
    }
  }

  setFilter(filter: typeof this.activeFilter) {
    this.activeFilter = filter;
  }

  getFilteredDeadlines(): Deadline[] {
    switch (this.activeFilter) {
      case 'active':
        return this.deadlines.filter(d => d.status === 'active' && !this.isOverdue(d));
      case 'overdue':
        return this.deadlines.filter(d => this.isOverdue(d) && d.status !== 'completed');
      case 'completed':
        return this.deadlines.filter(d => d.status === 'completed');
      default:
        return this.deadlines;
    }
  }

  isOverdue(deadline: Deadline): boolean {
    return new Date(deadline.dueDate) < new Date() && deadline.status !== 'completed';
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEmptyMessage(): string {
    switch (this.activeFilter) {
      case 'active':
        return 'No active deadlines. Great job staying on top of things!';
      case 'overdue':
        return 'No overdue deadlines. Keep up the excellent work!';
      case 'completed':
        return 'No completed deadlines yet. Start completing some tasks!';
      default:
        return 'No deadlines created yet. Click "Add Deadline" to get started.';
    }
  }

  addQuickDeadline(type: 'today' | 'tomorrow' | 'week') {
    const today = new Date();
    let dueDate: string;
    let title: string;

    switch (type) {
      case 'today':
        dueDate = today.toISOString().split('T')[0];
        title = 'Quick task due today';
        break;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
        title = 'Quick task due tomorrow';
        break;
      case 'week':
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        dueDate = nextWeek.toISOString().split('T')[0];
        title = 'Quick task due next week';
        break;
    }

    const customTitle = prompt('Enter deadline title:', title);
    if (customTitle) {
      const deadline: Deadline = {
        id: `deadline-${Date.now()}`,
        title: customTitle,
        dueDate,
        priority: type === 'today' ? 'urgent' : 'medium',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.storageService.addDeadline(deadline);
    }
  }

  clearCompleted() {
    if (confirm('Are you sure you want to delete all completed deadlines?')) {
      const completed = this.deadlines.filter(d => d.status === 'completed');
      completed.forEach(deadline => {
        this.storageService.removeDeadline(deadline.id);
      });
    }
  }
}
