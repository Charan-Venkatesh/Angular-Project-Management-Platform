import { Injectable, signal } from '@angular/core';
import { Project } from '../model/project.model';
import { Task, Priority } from '../model/task.model';
import { Deadline } from '../components/deadline/deadline-manager';

@Injectable({ providedIn: 'root' })
export class StorageService {
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  deadlines = signal<Deadline[]>([]);
  currentProject = signal<Project | null>(null);

  constructor() {
    this.loadData();
    // If no data exists, initialize with sample data
    if (this.projects().length === 0) {
      this.initializeSampleData();
    }

    // Initialize sample deadlines if none exist
    if (this.deadlines().length === 0) {
      this.initializeSampleDeadlines();
    }
  }

  private initializeSampleData(): void {
    const sampleProjects: Project[] = [
      {
        id: 'demo-1',
        name: '🚀 Website Redesign',
        completed: false,
        color: '#1976d2',
        sections: [
          { id: 's1', name: 'To Do', position: 0, color: '#ff5722' },
          { id: 's2', name: 'In Progress', position: 1, color: '#ff9800' },
          { id: 's3', name: 'Done', position: 2, color: '#4caf50' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: []
      },
      {
        id: 'demo-2',
        name: '📱 Mobile App Development',
        completed: false,
        color: '#9c27b0',
        sections: [
          { id: 's4', name: 'Planning', position: 0, color: '#2196f3' },
          { id: 's5', name: 'Development', position: 1, color: '#ff9800' },
          { id: 's6', name: 'Testing', position: 2, color: '#ffc107' },
          { id: 's7', name: 'Completed', position: 3, color: '#4caf50' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: []
      },
      {
        id: 'demo-3',
        name: '💼 Marketing Campaign',
        completed: true,
        color: '#4caf50',
        sections: [
          { id: 's8', name: 'Research', position: 0, color: '#2196f3' },
          { id: 's9', name: 'Execution', position: 1, color: '#ff9800' },
          { id: 's10', name: 'Completed', position: 2, color: '#4caf50' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: []
      }
    ];

    const sampleTasks: Task[] = [
      // Website Redesign Tasks
      {
        id: 't1',
        title: 'Create wireframes for homepage',
        description: 'Design comprehensive wireframes showing layout, navigation, and key sections for the new homepage',
        projectId: 'demo-1',
        sectionId: 's1',
        status: 'todo',
        priority: 'high',
        completed: false,
        position: 0,
        dueDate: '2025-09-15',
        tags: ['design', 'wireframes', 'ux'],
        subtasks: [
          { id: 'st1', title: 'Research competitor layouts', completed: true },
          { id: 'st2', title: 'Sketch initial concepts', completed: false },
          { id: 'st3', title: 'Create digital wireframes', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 't2',
        title: 'Design new navigation system',
        description: 'Create intuitive and responsive navigation that works across all devices',
        projectId: 'demo-1',
        sectionId: 's2',
        status: 'in-progress',
        priority: 'medium',
        completed: false,
        position: 0,
        dueDate: '2025-09-20',
        tags: ['navigation', 'responsive', 'accessibility'],
        subtasks: [
          { id: 'st4', title: 'Design mobile menu', completed: true },
          { id: 'st5', title: 'Create desktop navigation', completed: true },
          { id: 'st6', title: 'Test accessibility features', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 't3',
        title: 'Update brand colors and typography',
        description: 'Implement new brand guidelines across all design elements',
        projectId: 'demo-1',
        sectionId: 's3',
        status: 'completed',
        completed: true,
        position: 0,
        tags: ['branding', 'typography', 'colors'],
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Mobile App Tasks
      {
        id: 't4',
        title: 'User research and requirements gathering',
        description: 'Conduct comprehensive user interviews and surveys to understand needs and pain points',
        projectId: 'demo-2',
        sectionId: 's4',
        status: 'todo',
        priority: 'urgent',
        completed: false,
        position: 0,
        dueDate: '2025-09-12',
        tags: ['research', 'user-experience', 'requirements'],
        subtasks: [
          { id: 'st7', title: 'Create survey questions', completed: false },
          { id: 'st8', title: 'Schedule user interviews', completed: false },
          { id: 'st9', title: 'Analyze research data', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 't5',
        title: 'Build authentication system',
        description: 'Implement secure user authentication with social login options',
        projectId: 'demo-2',
        sectionId: 's5',
        status: 'in-progress',
        priority: 'high',
        completed: false,
        position: 0,
        dueDate: '2025-09-25',
        tags: ['authentication', 'security', 'backend'],
        subtasks: [
          { id: 'st10', title: 'Set up OAuth providers', completed: true },
          { id: 'st11', title: 'Implement JWT tokens', completed: true },
          { id: 'st12', title: 'Add password reset', completed: false },
          { id: 'st13', title: 'Test security measures', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 't6',
        title: 'Implement dark mode support',
        description: 'Add system-wide dark mode toggle with user preferences',
        projectId: 'demo-2',
        sectionId: 's5',
        status: 'in-progress',
        priority: 'medium',
        completed: false,
        position: 1,
        dueDate: '2025-09-30',
        tags: ['ui', 'themes', 'accessibility'],
        subtasks: [
          { id: 'st14', title: 'Design dark theme colors', completed: true },
          { id: 'st15', title: 'Implement theme switching', completed: false },
          { id: 'st16', title: 'Test with all components', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Marketing Campaign Tasks (Completed)
      {
        id: 't7',
        title: 'Launch social media campaign',
        description: 'Execute comprehensive social media strategy across all platforms',
        projectId: 'demo-3',
        sectionId: 's10',
        status: 'completed',
        completed: true,
        position: 0,
        tags: ['social-media', 'marketing', 'content'],
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 't8',
        title: 'Create email marketing templates',
        description: 'Design responsive email templates for various campaign types',
        projectId: 'demo-3',
        sectionId: 's10',
        status: 'completed',
        completed: true,
        position: 1,
        tags: ['email-marketing', 'templates', 'design'],
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Additional advanced tasks
      {
        id: 't9',
        title: 'Performance optimization',
        description: 'Optimize application performance and loading times',
        projectId: 'demo-2',
        sectionId: 's6',
        status: 'todo',
        priority: 'high',
        completed: false,
        position: 0,
        dueDate: '2025-10-05',
        tags: ['performance', 'optimization', 'testing'],
        subtasks: [
          { id: 'st17', title: 'Analyze bundle size', completed: false },
          { id: 'st18', title: 'Implement lazy loading', completed: false },
          { id: 'st19', title: 'Optimize images', completed: false },
          { id: 'st20', title: 'Performance testing', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Set the sample data
    this.projects.set(sampleProjects);
    this.tasks.set(sampleTasks);
    this.saveData();
  }

  private initializeSampleDeadlines(): void {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const overdue = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const sampleDeadlines: Deadline[] = [
      {
        id: 'deadline-1',
        title: '🎯 Complete Project Proposal',
        dueDate: tomorrow.toISOString(),
        priority: 'high',
        status: 'active',
        projectId: 'demo-1',
        reminder: {
          enabled: true,
          interval: 4,
          notified: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'deadline-2',
        title: '📊 Submit Monthly Report',
        dueDate: overdue.toISOString(),
        priority: 'urgent',
        status: 'active',
        reminder: {
          enabled: true,
          interval: 24,
          notified: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'deadline-3',
        title: '🚀 Deploy New Features',
        dueDate: nextWeek.toISOString(),
        priority: 'medium',
        status: 'active',
        projectId: 'demo-2',
        reminder: {
          enabled: true,
          interval: 48,
          notified: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'deadline-4',
        title: '✅ Code Review Complete',
        dueDate: now.toISOString(),
        priority: 'high',
        status: 'completed',
        projectId: 'demo-1',
        reminder: {
          enabled: false,
          interval: 24,
          notified: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'deadline-5',
        title: '🔄 System Maintenance Window',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        status: 'active',
        reminder: {
          enabled: true,
          interval: 72,
          notified: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.deadlines.set(sampleDeadlines);
    this.saveData();
  }

  loadData(): void {
    const projectsJson = localStorage.getItem('projects');
    const tasksJson = localStorage.getItem('tasks');
    const deadlinesJson = localStorage.getItem('deadlines');

    if (projectsJson) {
      this.projects.set(JSON.parse(projectsJson));
    }

    if (tasksJson) {
      this.tasks.set(JSON.parse(tasksJson));
    }

    if (deadlinesJson) {
      this.deadlines.set(JSON.parse(deadlinesJson));
    }
  }

  saveData(): void {
    localStorage.setItem('projects', JSON.stringify(this.projects()));
    localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    localStorage.setItem('deadlines', JSON.stringify(this.deadlines()));
  }

  addProject(project: Project): void {
    this.projects.update(projects => [...projects, project]);
    this.saveData();
  }

  editProject(updated: Project): void {
    this.projects.update(projects =>
      projects.map(p => (p.id === updated.id ? updated : p))
    );
    this.saveData();
  }

  setCurrentProject(id: string): void {
    const found = this.projects().find(p => p.id === id) || null;
    this.currentProject.set(found);
  }

  deleteProject(id: string): void {
    this.projects.update(projects => projects.filter(p => p.id !== id));
    this.tasks.update(tasks => tasks.filter(t => t.projectId !== id));
    this.saveData();
  }

  toggleProjectComplete(id: string): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === id ? { ...p, completed: !p.completed } : p
      )
    );
    this.saveData();
  }

  addTask(task: Task): void {
    this.tasks.update(tasks => [...tasks, task]);
    this.saveData();
  }

  editTask(updated: Task): void {
    this.tasks.update(tasks =>
      tasks.map(t => (t.id === updated.id ? updated : t))
    );
    this.saveData();
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.saveData();
  }

  toggleTaskComplete(id: string): void {
    this.tasks.update(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
    this.saveData();
  }

  getProjects(): Project[] {
    return this.projects();
  }

  getTasks(): Task[] {
    return this.tasks();
  }

  getTasksByProject(projectId: string): Task[] {
    return this.tasks().filter(t => t.projectId === projectId);
  }

  // Advanced task queries
  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks().filter(t => t.priority === priority && !t.completed);
  }

  getOverdueTasks(): Task[] {
    const now = new Date().toISOString().split('T')[0];
    return this.tasks().filter(t => 
      t.dueDate && t.dueDate < now && !t.completed
    );
  }

  getUpcomingTasks(days = 7): Task[] {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return this.tasks()
      .filter(t => t.dueDate && !t.completed)
      .filter(t => {
        const dueDate = new Date(t.dueDate!);
        return dueDate >= now && dueDate <= future;
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }

  // Task operations with subtasks support
  updateTask(updated: Task): void {
    this.tasks.update(tasks =>
      tasks.map(t => (t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t))
    );
    this.saveData();
  }

  moveTaskToSection(taskId: string, newSectionId: string): void {
    this.tasks.update(tasks =>
      tasks.map(t => 
        t.id === taskId 
          ? { ...t, sectionId: newSectionId, updatedAt: new Date().toISOString() }
          : t
      )
    );
    this.saveData();
  }

  duplicateTask(taskId: string): void {
    const task = this.tasks().find(t => t.id === taskId);
    if (task) {
      const duplicatedTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        title: `${task.title} (Copy)`,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: task.subtasks?.map(st => ({
          ...st,
          id: `subtask-${Date.now()}-${Math.random()}`,
          completed: false
        }))
      };
      this.addTask(duplicatedTask);
    }
  }

  // Project analytics
  getProjectStats(projectId: string) {
    const tasks = this.getTasksByProject(projectId);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    return {
      totalTasks,
      completedTasks,
      activeTasks: totalTasks - completedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      priorityBreakdown: {
        urgent: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
        high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
        medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
        low: tasks.filter(t => t.priority === 'low' && !t.completed).length
      }
    };
  }

  // Search functionality
  searchTasks(query: string): Task[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tasks().filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      (task.description && task.description.toLowerCase().includes(lowercaseQuery)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  searchProjects(query: string): Project[] {
    const lowercaseQuery = query.toLowerCase();
    return this.projects().filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      (project.description && project.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Bulk operations
  bulkUpdateTasks(taskIds: string[], updates: Partial<Task>): void {
    this.tasks.update(tasks =>
      tasks.map(t => 
        taskIds.includes(t.id) 
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
    this.saveData();
  }

  bulkDeleteTasks(taskIds: string[]): void {
    this.tasks.update(tasks => tasks.filter(t => !taskIds.includes(t.id)));
    this.saveData();
  }

  addUpdate(projectId: string, action: string, user = 'You'): void {
    this.projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {
            ...p,
            updates: [
              ...(p.updates || []),
              { user, action, date: new Date().toISOString() }
            ],
          }
          : p
      )
    );
    this.saveData();
  }

  // Deadline Management Methods
  addDeadline(deadline: Deadline): void {
    this.deadlines.update(deadlines => [...deadlines, deadline]);
    this.saveData();
  }

  updateDeadline(updatedDeadline: Deadline): void {
    this.deadlines.update(deadlines =>
      deadlines.map(d =>
        d.id === updatedDeadline.id ? updatedDeadline : d
      )
    );
    this.saveData();
  }

  removeDeadline(deadlineId: string): void {
    this.deadlines.update(deadlines =>
      deadlines.filter(d => d.id !== deadlineId)
    );
    this.saveData();
  }

  getDeadlinesByProject(projectId: string): Deadline[] {
    return this.deadlines().filter(d => d.projectId === projectId);
  }

  getOverdueDeadlines(): Deadline[] {
    const now = new Date();
    return this.deadlines().filter(d => 
      new Date(d.dueDate) < now && d.status !== 'completed'
    );
  }

  getUpcomingDeadlines(hours: number = 24): Deadline[] {
    const now = new Date();
    const upcoming = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.deadlines().filter(d => {
      const dueDate = new Date(d.dueDate);
      return dueDate > now && dueDate <= upcoming && d.status !== 'completed';
    });
  }

  getDeadlinesByPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): Deadline[] {
    return this.deadlines().filter(d => d.priority === priority && d.status !== 'completed');
  }

  getDeadlinesRequiringReminders(): Deadline[] {
    const now = new Date();
    
    return this.deadlines().filter(d => {
      if (!d.reminder?.enabled || d.reminder.notified || d.status === 'completed') {
        return false;
      }
      
      const dueDate = new Date(d.dueDate);
      const reminderTime = new Date(dueDate.getTime() - d.reminder.interval * 60 * 60 * 1000);
      
      return now >= reminderTime && now < dueDate;
    });
  }

  markDeadlineNotified(deadlineId: string): void {
    this.deadlines.update(deadlines =>
      deadlines.map(d =>
        d.id === deadlineId && d.reminder
          ? { ...d, reminder: { ...d.reminder, notified: true } }
          : d
      )
    );
    this.saveData();
  }

  getDeadlineStats() {
    const deadlines = this.deadlines();
    const now = new Date();
    
    return {
      total: deadlines.length,
      active: deadlines.filter(d => d.status === 'active').length,
      completed: deadlines.filter(d => d.status === 'completed').length,
      overdue: deadlines.filter(d => new Date(d.dueDate) < now && d.status !== 'completed').length,
      urgent: deadlines.filter(d => d.priority === 'urgent' && d.status !== 'completed').length,
      dueToday: deadlines.filter(d => {
        const dueDate = new Date(d.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString() && d.status !== 'completed';
      }).length
    };
  }

  clearCompletedDeadlines(): void {
    this.deadlines.update(deadlines =>
      deadlines.filter(d => d.status !== 'completed')
    );
    this.saveData();
  }
}
