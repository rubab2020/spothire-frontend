import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobShareComponent } from './job-share.component';

describe('JobShareComponent', () => {
  let component: JobShareComponent;
  let fixture: ComponentFixture<JobShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
