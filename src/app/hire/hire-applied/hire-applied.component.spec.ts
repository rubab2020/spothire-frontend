import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAppliedComponent } from './hire-applied.component';

describe('HireAppliedComponent', () => {
  let component: HireAppliedComponent;
  let fixture: ComponentFixture<HireAppliedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireAppliedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
