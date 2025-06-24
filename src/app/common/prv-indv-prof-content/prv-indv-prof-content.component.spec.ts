import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrvIndvProfContentComponent } from './prv-indv-prof-content.component';

describe('PrvIndvProfContentComponent', () => {
  let component: PrvIndvProfContentComponent;
  let fixture: ComponentFixture<PrvIndvProfContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrvIndvProfContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrvIndvProfContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
