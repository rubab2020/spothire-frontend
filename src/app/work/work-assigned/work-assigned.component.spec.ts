import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAssignedComponent } from './work-assigned.component';

describe('WorkAssignedComponent', () => {
  let component: WorkAssignedComponent;
  let fixture: ComponentFixture<WorkAssignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAssignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
