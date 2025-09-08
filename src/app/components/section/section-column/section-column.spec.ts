import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionColumn } from './section-column';
import { Section } from '../../../model/project.model';

describe('SectionColumn', () => {
  let component: SectionColumn;
  let fixture: ComponentFixture<SectionColumn>;

  const mockSection: Section = {
    id: 'section-1',
    name: 'Test Section',
    position: 0,
    color: '#2196f3'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionColumn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionColumn);
    component = fixture.componentInstance;
    component.section = mockSection;
    component.tasks = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
