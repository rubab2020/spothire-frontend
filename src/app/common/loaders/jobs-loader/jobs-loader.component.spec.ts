import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsLoaderComponent } from './jobs-loader.component';

describe('JobsLoaderComponent', () => {
  let component: JobsLoaderComponent;
  let fixture: ComponentFixture<JobsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
