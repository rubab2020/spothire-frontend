import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrvJobContentComponent } from './prv-job-content.component';

describe('PrvJobContentComponent', () => {
  let component: PrvJobContentComponent;
  let fixture: ComponentFixture<PrvJobContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrvJobContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrvJobContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
