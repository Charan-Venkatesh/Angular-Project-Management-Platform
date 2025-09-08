import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DeadlineManagerComponent } from './components/deadline/deadline-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DeadlineManagerComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">🎯 Project Manager Pro</h1>
          <nav class="app-nav">
            <button 
              class="nav-btn" 
              [class.active]="isRoute('/dashboard')"
              (click)="navigateTo('/dashboard')"
            >
              � Dashboard
            </button>
            <button 
              class="nav-btn" 
              [class.active]="isRoute('/projects')"
              (click)="navigateTo('/projects')"
            >
              � Projects
            </button>
            <button 
              class="nav-btn" 
              [class.active]="isRoute('/todo')"
              (click)="navigateTo('/todo')"
            >
              📋 Quick Todo
            </button>
            <button 
              class="nav-btn" 
              [class.active]="currentView === 'deadlines'"
              (click)="toggleDeadlines()"
            >
              ⏰ Deadlines
            </button>
          </nav>
        </div>
      </header>

      <main class="app-content">
        <!-- Deadlines Overlay/Modal -->
        <div class="deadlines-overlay" *ngIf="currentView === 'deadlines'" (click)="closeDeadlines()">
          <div class="deadlines-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>⏰ Deadline Management</h2>
              <button class="close-btn" (click)="closeDeadlines()">✕</button>
            </div>
            <div class="modal-content">
              <app-deadline-manager></app-deadline-manager>
            </div>
          </div>
        </div>

        <!-- Main Router Content -->
        <div class="view-container" [class.blurred]="currentView === 'deadlines'">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .app-title {
      color: white;
      margin: 0 0 1.5rem 0;
      font-size: 2.5rem;
      font-weight: 300;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .app-nav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .nav-btn {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      font-weight: 500;
      backdrop-filter: blur(10px);
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
    }

    .nav-btn.active {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
    }

    .app-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
    }

    .view-container {
      animation: fadeIn 0.4s ease-in-out;
      transition: filter 0.3s ease;
    }

    .view-container.blurred {
      filter: blur(5px);
      pointer-events: none;
    }

    .deadlines-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .deadlines-modal {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-header h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .modal-content {
      padding: 2rem;
      max-height: 70vh;
      overflow-y: auto;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(50px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }

    @media (max-width: 768px) {
      .app-content {
        padding: 1rem;
      }
      
      .header-content {
        padding: 0 1rem;
      }

      .app-title {
        font-size: 2rem;
      }

      .nav-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }

      .deadlines-modal {
        max-width: 95vw;
        max-height: 95vh;
      }

      .modal-header {
        padding: 1rem;
      }

      .modal-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'angular-todo-app';
  currentView: 'normal' | 'deadlines' = 'normal';
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Track current route for active states
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  navigateTo(route: string) {
    this.currentView = 'normal';
    this.router.navigate([route]);
  }

  isRoute(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  toggleDeadlines() {
    this.currentView = this.currentView === 'deadlines' ? 'normal' : 'deadlines';
  }

  closeDeadlines() {
    this.currentView = 'normal';
  }
}
