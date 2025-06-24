import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsFilterModalComponent } from './jobs-filter-modal.component';

describe('JobsFilterModalComponent', () => {
  let component: JobsFilterModalComponent;
  let fixture: ComponentFixture<JobsFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
