import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAppliedFilterModalComponent } from './hire-applied-filter-modal.component';

describe('HireAppliedFilterModalComponent', () => {
  let component: HireAppliedFilterModalComponent;
  let fixture: ComponentFixture<HireAppliedFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireAppliedFilterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireAppliedFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
