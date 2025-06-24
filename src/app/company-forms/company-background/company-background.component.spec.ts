import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBackgroundComponent } from './company-background.component';

describe('CompanyBackgroundComponent', () => {
  let component: CompanyBackgroundComponent;
  let fixture: ComponentFixture<CompanyBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
