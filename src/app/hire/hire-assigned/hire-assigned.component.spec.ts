import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAssignedComponent } from './hire-assigned.component';

describe('HireAssignedComponent', () => {
  let component: HireAssignedComponent;
  let fixture: ComponentFixture<HireAssignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireAssignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
