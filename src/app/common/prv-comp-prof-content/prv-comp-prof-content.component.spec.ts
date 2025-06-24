import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrvCompProfContentComponent } from './prv-comp-prof-content.component';

describe('PrvCompProfContentComponent', () => {
  let component: PrvCompProfContentComponent;
  let fixture: ComponentFixture<PrvCompProfContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrvCompProfContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrvCompProfContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
