import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsLoaderComponent } from './applications-loader.component';

describe('ApplicationsLoaderComponent', () => {
  let component: ApplicationsLoaderComponent;
  let fixture: ComponentFixture<ApplicationsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
