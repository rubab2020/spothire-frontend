import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyValueComponent } from './company-value.component';

describe('CompanyValueComponent', () => {
  let component: CompanyValueComponent;
  let fixture: ComponentFixture<CompanyValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
