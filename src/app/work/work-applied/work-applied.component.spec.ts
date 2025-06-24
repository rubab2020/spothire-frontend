import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAppliedComponent } from './work-applied.component';

describe('WorkAppliedComponent', () => {
  let component: WorkAppliedComponent;
  let fixture: ComponentFixture<WorkAppliedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkAppliedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
