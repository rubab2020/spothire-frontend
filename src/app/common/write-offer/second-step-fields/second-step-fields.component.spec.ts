import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondStepFieldsComponent } from './second-step-fields.component';

describe('SecondStepFieldsComponent', () => {
  let component: SecondStepFieldsComponent;
  let fixture: ComponentFixture<SecondStepFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondStepFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondStepFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
