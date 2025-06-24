import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOfferComponent } from './write-offer.component';

describe('WriteOfferComponent', () => {
  let component: WriteOfferComponent;
  let fixture: ComponentFixture<WriteOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
