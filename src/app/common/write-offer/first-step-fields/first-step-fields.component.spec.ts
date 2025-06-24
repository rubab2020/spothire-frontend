import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstStepFieldsComponent } from './first-step-fields.component';

describe('FirstStepFieldsComponent', () => {
  let component: FirstStepFieldsComponent;
  let fixture: ComponentFixture<FirstStepFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstStepFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstStepFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
