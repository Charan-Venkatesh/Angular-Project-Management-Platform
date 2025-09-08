import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div>
      <h1>Debug App - Testing if this renders</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    div {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #333;
      background: #f0f0f0;
      padding: 10px;
      border-radius: 5px;
    }
  `]
})
export class AppComponent {
  title = 'angular-todo-app-debug';
}
