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
    <div class="deadline-manager glass-card">
      <div class="deadline-header">
        <h3 class="text-gradient">⏰ Deadline Manager</h3>
        <button class="btn-interactive liquid-btn" (click)="toggleAddForm()">
          {{ showAddForm ? '❌ Cancel' : '➕ Add Deadline' }}
        </button>
      </div>

      <!-- Quick Add Deadline Form -->
      <div class="deadline-add-form fade-in" *ngIf="showAddForm">
        <div class="form-grid">
          <div class="form-group">
            <label for="deadlineTitle">Deadline Title *</label>
            <input 
              id="deadlineTitle"
              type="text" 
              [(ngModel)]="newDeadline.title" 
              placeholder="Enter deadline title..."
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="deadlineDate">Due Date *</label>
            <input 
              id="deadlineDate"
              type="date" 
              [(ngModel)]="newDeadline.dueDate"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="deadlinePriority">Priority Level</label>
            <select 
              id="deadlinePriority"
              [(ngModel)]="newDeadline.priority" 
              class="form-control">
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🟠 High Priority</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>

          <div class="form-group reminder-group">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="newDeadline.reminder!.enabled"
                class="checkbox-control"
              />
              Enable Reminder
            </label>
            <div *ngIf="newDeadline.reminder!.enabled" class="reminder-settings">
              <select [(ngModel)]="newDeadline.reminder!.interval" class="form-control-sm">
                <option value="1">1 hour before</option>
                <option value="6">6 hours before</option>
                <option value="24">1 day before</option>
                <option value="72">3 days before</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="addDeadline()">
            ✅ Create Deadline
          </button>
          <button class="btn-secondary" (click)="cancelAdd()">
            ❌ Cancel
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="deadline-filters">
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')">
            📋 All ({{ deadlines.length }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter === 'active'"
            (click)="setFilter('active')">
            ⏳ Active ({{ getActiveDeadlines().length }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter === 'overdue'"
            (click)="setFilter('overdue')">
            🔥 Overdue ({{ getOverdueDeadlines().length }})
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter === 'completed'"
            (click)="setFilter('completed')">
            ✅ Completed ({{ getCompletedDeadlines().length }})
          </button>
        </div>

        <div class="deadline-stats">
          <div class="stat-item">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ deadlines.length }}</span>
          </div>
          <div class="stat-item urgent">
            <span class="stat-label">Urgent:</span>
            <span class="stat-value">{{ getUrgentDeadlines().length }}</span>
          </div>
        </div>
      </div>

      <!-- Deadlines List -->
      <div class="deadlines-list">
        <div 
          *ngFor="let deadline of getFilteredDeadlines(); let i = index" 
          class="deadline-item hover-lift card-3d"
          [class.overdue]="isOverdue(deadline)"
          [class.urgent]="deadline.priority === 'urgent'"
          [class.completed]="deadline.status === 'completed'">
          
          <div class="deadline-main">
            <div class="deadline-info">
              <div class="deadline-title">
                <h4>{{ deadline.title }}</h4>
                <span class="deadline-priority" [class]="deadline.priority">
                  {{ getPriorityIcon(deadline.priority) }}
                </span>
              </div>
              <div class="deadline-meta">
                <span class="due-date" [class.overdue]="isOverdue(deadline)">
                  📅 Due: {{ formatDate(deadline.dueDate) }}
                </span>
                <span class="deadline-status" [class]="deadline.status">
                  {{ deadline.status }}
                </span>
              </div>
            </div>
            
            <div class="deadline-actions">
              <button 
                class="action-btn complete-btn" 
                [class.completed]="deadline.status === 'completed'"
                (click)="toggleComplete(deadline)"
                [title]="deadline.status === 'completed' ? 'Mark as active' : 'Mark as completed'">
                {{ deadline.status === 'completed' ? '↩️' : '✅' }}
              </button>
              <button 
                class="action-btn edit-btn" 
                (click)="editDeadline(deadline)"
                title="Edit deadline">
                ✏️
              </button>
              <button 
                class="action-btn delete-btn" 
                (click)="removeDeadline(deadline.id)"
                title="Delete deadline">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="getFilteredDeadlines().length === 0">
          <div class="empty-icon">⏰</div>
          <h4>No deadlines found</h4>
          <p>{{ getEmptyStateMessage() }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="quick-action-btn" (click)="addQuickDeadline('today')">
          📅 Due Today
        </button>
        <button class="quick-action-btn" (click)="addQuickDeadline('tomorrow')">
          🌅 Due Tomorrow
        </button>
        <button class="quick-action-btn" (click)="addQuickDeadline('week')">
          📆 Due This Week
        </button>
        <button class="quick-action-btn" (click)="clearCompleted()">
          🧹 Clear Completed
        </button>
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

    .deadline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .text-gradient {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 1.8rem;
      margin: 0;
    }

    .btn-interactive {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-interactive:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .deadline-add-form {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 15px;
      margin-bottom: 2rem;
      animation: fadeIn 0.3s ease;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: white;
      font-weight: 500;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-primary {
      background: linear-gradient(45deg, #4caf50, #45a049);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .deadline-filters {
      margin-bottom: 2rem;
    }

    .filter-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .filter-tab {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-tab.active {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      color: #333;
      font-weight: 600;
    }

    .deadline-stats {
      display: flex;
      gap: 2rem;
    }

    .stat-item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.8);
    }

    .stat-value {
      color: #ffd700;
      font-weight: bold;
      font-size: 1.1rem;
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

    .deadline-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .deadline-info {
      flex: 1;
    }

    .deadline-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .deadline-title h4 {
      color: white;
      margin: 0;
      font-size: 1.1rem;
    }

    .deadline-priority {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .deadline-priority.low {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }

    .deadline-priority.medium {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .deadline-priority.high {
      background: rgba(255, 152, 0, 0.2);
      color: #ff9800;
    }

    .deadline-priority.urgent {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
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

    .due-date.overdue {
      color: #ff4444;
      font-weight: 600;
    }

    .deadline-status {
      padding: 0.25rem 0.75rem;
      border-radius: 10px;
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
    }

    .deadline-status.active {
      background: rgba(33, 150, 243, 0.2);
      color: #2196f3;
    }

    .deadline-status.completed {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }

    .deadline-status.overdue {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
    }

    .deadline-actions {
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

    .quick-action-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .quick-action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .deadline-manager {
        padding: 1rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .filter-tabs {
        justify-content: center;
      }
      
      .deadline-main {
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
    priority: 'medium',
    reminder: {
      enabled: false,
      interval: 24,
      notified: false
    }
  };

  get deadlines(): Deadline[] {
    return this.storageService.deadlines();
  }

  ngOnInit() {
    this.checkReminders();
    setInterval(() => this.checkReminders(), 60000);
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
      priority: 'medium',
      reminder: {
        enabled: false,
        interval: 24,
        notified: false
      }
    };
  }

  addDeadline() {
    if (!this.newDeadline.title || !this.newDeadline.dueDate) return;

    const deadline: Deadline = {
      id: `deadline-${Date.now()}`,
      title: this.newDeadline.title,
      dueDate: this.newDeadline.dueDate,
      priority: this.newDeadline.priority || 'medium',
      status: 'active',
      reminder: this.newDeadline.reminder,
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
        return this.getActiveDeadlines();
      case 'overdue':
        return this.getOverdueDeadlines();
      case 'completed':
        return this.getCompletedDeadlines();
      default:
        return this.deadlines;
    }
  }

  getActiveDeadlines(): Deadline[] {
    return this.deadlines.filter(d => d.status === 'active' && !this.isOverdue(d));
  }

  getOverdueDeadlines(): Deadline[] {
    return this.deadlines.filter(d => this.isOverdue(d) && d.status !== 'completed');
  }

  getCompletedDeadlines(): Deadline[] {
    return this.deadlines.filter(d => d.status === 'completed');
  }

  getUrgentDeadlines(): Deadline[] {
    return this.deadlines.filter(d => d.priority === 'urgent' && d.status !== 'completed');
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

  getEmptyStateMessage(): string {
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
      default:
        return;
    }

    const customTitle = prompt('Enter deadline title:', title);
    if (customTitle) {
      const deadline: Deadline = {
        id: `deadline-${Date.now()}`,
        title: customTitle,
        dueDate,
        priority: type === 'today' ? 'urgent' : 'medium',
        status: 'active',
        reminder: {
          enabled: true,
          interval: type === 'today' ? 1 : 24,
          notified: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.storageService.addDeadline(deadline);
    }
  }

  clearCompleted() {
    if (confirm('Are you sure you want to delete all completed deadlines?')) {
      const completedDeadlines = this.getCompletedDeadlines();
      completedDeadlines.forEach(deadline => {
        this.storageService.removeDeadline(deadline.id);
      });
    }
  }

  checkReminders() {
    const now = new Date();
    this.deadlines.forEach(deadline => {
      if (deadline.reminder?.enabled && !deadline.reminder.notified && deadline.status === 'active') {
        const dueDate = new Date(deadline.dueDate);
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilDue <= deadline.reminder.interval && hoursUntilDue > 0) {
          this.showNotification(deadline);
          deadline.reminder.notified = true;
          this.storageService.updateDeadline(deadline);
        }
      }
    });
  }

  private showNotification(deadline: Deadline) {
    if (Notification.permission === 'granted') {
      new Notification('Deadline Reminder', {
        body: `${deadline.title} is due on ${this.formatDate(deadline.dueDate)}`,
        icon: '/favicon.ico'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showNotification(deadline);
        }
      });
    }
  }
}
