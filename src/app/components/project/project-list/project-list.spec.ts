import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ProjectListComponent } from './project-list';
import { StorageService } from '../../../services/storage.service';
import { Project } from '../../../model/project.model';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Test Project 1',
      completed: false,
      color: '#blue',
      sections: [],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      updates: []
    },
    {
      id: '2',
      name: 'Completed Project',
      completed: true,
      color: '#green',
      sections: [],
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
      updates: []
    }
  ];

  beforeEach(async () => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', 
      ['addProject', 'toggleProjectComplete', 'deleteProject', 'setCurrentProject'],
      {
        projects: signal(mockProjects)
      }
    );
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockStorageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display projects', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const projectItems = compiled.querySelectorAll('.projects li');
    expect(projectItems.length).toBe(2);
  });

  it('should filter projects by search term', () => {
    component.searchTerm = 'Completed';
    const filtered = component.filteredProjects();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Completed Project');
  });

  it('should add a new project', () => {
    component.newProjectName = 'New Test Project';
    component.addProject();
    
    expect(mockStorageService.addProject).toHaveBeenCalled();
    expect(component.newProjectName).toBe('');
  });

  it('should not add empty project', () => {
    component.newProjectName = '   ';
    component.addProject();
    
    expect(mockStorageService.addProject).not.toHaveBeenCalled();
  });

  it('should navigate to project detail', () => {
    component.selectProject(mockProjects[0]);
    
    expect(mockStorageService.setCurrentProject).toHaveBeenCalledWith('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/project', '1']);
  });

  it('should toggle project completion', () => {
    component.toggleComplete(mockProjects[0]);
    
    expect(mockStorageService.toggleProjectComplete).toHaveBeenCalledWith('1');
  });

  it('should delete project', () => {
    component.deleteProject(mockProjects[0]);
    
    expect(mockStorageService.deleteProject).toHaveBeenCalledWith('1');
  });
});
