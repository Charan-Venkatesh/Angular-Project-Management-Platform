import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  template: '<div>Mock Project List</div>',
  standalone: true
})
class MockProjectListComponent {}

@Component({
  template: '<div>Mock Project Detail</div>',
  standalone: true
})
class MockProjectDetailComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: '', redirectTo: '/projects', pathMatch: 'full' },
          { path: 'projects', component: MockProjectListComponent },
          { path: 'project/:id', component: MockProjectDetailComponent },
        ])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1 a')?.textContent).toContain('Project Manager');
  });
});
