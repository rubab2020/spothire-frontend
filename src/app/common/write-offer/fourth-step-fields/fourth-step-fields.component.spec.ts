import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthStepFieldsComponent } from './fourth-step-fields.component';

describe('FourthStepFieldsComponent', () => {
  let component: FourthStepFieldsComponent;
  let fixture: ComponentFixture<FourthStepFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourthStepFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourthStepFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
