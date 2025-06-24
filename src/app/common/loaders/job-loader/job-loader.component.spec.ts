import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLoaderComponent } from './job-loader.component';

describe('JobLoaderComponent', () => {
  let component: JobLoaderComponent;
  let fixture: ComponentFixture<JobLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
