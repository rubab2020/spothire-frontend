import { TestBed, inject } from '@angular/core/testing';

import { SharedProfileService } from './shared-profile.service';

describe('SharedProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedProfileService]
    });
  });

  it('should be created', inject([SharedProfileService], (service: SharedProfileService) => {
    expect(service).toBeTruthy();
  }));
});
