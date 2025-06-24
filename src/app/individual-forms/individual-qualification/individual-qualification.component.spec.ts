import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualQualificationComponent } from './individual-qualification.component';

describe('IndividualQualificationComponent', () => {
  let component: IndividualQualificationComponent;
  let fixture: ComponentFixture<IndividualQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
