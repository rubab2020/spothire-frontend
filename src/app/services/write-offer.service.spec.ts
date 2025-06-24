import { TestBed, inject } from '@angular/core/testing';

import { WriteOfferService } from './write-offer.service';

describe('WriteOfferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WriteOfferService]
    });
  });

  it('should be created', inject([WriteOfferService], (service: WriteOfferService) => {
    expect(service).toBeTruthy();
  }));
});
