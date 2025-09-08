import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { ProjectDetail } from './project-detail';
import { StorageService } from '../../../services/storage.service';
import { Project } from '../../../model/project.model';
import { Task } from '../../../model/task.model';

describe('ProjectDetail', () => {
  let component: ProjectDetail;
  let fixture: ComponentFixture<ProjectDetail>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockActivatedRoute: any;

  const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    completed: false,
    color: '#blue',
    sections: [
      { id: 's1', name: 'To Do', position: 0, color: '#red' },
      { id: 's2', name: 'Done', position: 1, color: '#green' }
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    updates: []
  };

  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Test Task 1',
      projectId: '1',
      sectionId: 's1',
      status: 'todo',
      completed: false,
      position: 0,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: 't2',
      title: 'Test Task 2',
      projectId: '1',
      sectionId: 's2',
      status: 'completed',
      completed: true,
      position: 0,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    }
  ];

  beforeEach(async () => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', 
      ['getTasksByProject', 'addTask', 'deleteTask', 'editProject'],
      {
        projects: signal([mockProject])
      }
    );
    
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDetail],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockStorageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    mockStorageService.getTasksByProject.and.returnValue(mockTasks);
    
    fixture = TestBed.createComponent(ProjectDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project on init', () => {
    expect(component.project).toEqual(mockProject);
  });

  it('should get tasks for section', () => {
    const tasks = component.tasksForSection('s1');
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Test Task 1');
  });

  it('should add new section', () => {
    component.newSectionName = 'In Progress';
    component.addSection();
    
    expect(component.project!.sections.length).toBe(3);
    expect(component.project!.sections[2].name).toBe('In Progress');
    expect(component.newSectionName).toBe('');
  });

  it('should toggle task completion', () => {
    const task = mockTasks[0];
    const originalCompleted = task.completed;
    
    component.toggleTask(task);
    
    expect(task.completed).toBe(!originalCompleted);
  });

  it('should delete task', () => {
    const task = mockTasks[0];
    component.deleteTask(task);
    
    expect(mockStorageService.deleteTask).toHaveBeenCalledWith('t1');
  });

  it('should check remaining tasks count', () => {
    spyOn(component, 'tasksForSection').and.returnValue(mockTasks);
    
    expect(component.remainingTasksCount('s1')).toBe(1);
  });
});
