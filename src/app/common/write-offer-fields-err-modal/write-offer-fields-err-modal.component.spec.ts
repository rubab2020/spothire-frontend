import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOfferFieldsErrModalComponent } from './write-offer-fields-err-modal.component';

describe('WriteOfferFieldsErrModalComponent', () => {
  let component: WriteOfferFieldsErrModalComponent;
  let fixture: ComponentFixture<WriteOfferFieldsErrModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOfferFieldsErrModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOfferFieldsErrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
