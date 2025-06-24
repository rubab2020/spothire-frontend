import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicWriteOfferComponent } from './public-write-offer.component';

describe('PublicWriteOfferComponent', () => {
  let component: PublicWriteOfferComponent;
  let fixture: ComponentFixture<PublicWriteOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicWriteOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicWriteOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
