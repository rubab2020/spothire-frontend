import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HireOrServeComponent } from './hire-or-serve.component';

describe('HireOrServeComponent', () => {
  let component: HireOrServeComponent;
  let fixture: ComponentFixture<HireOrServeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HireOrServeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireOrServeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
