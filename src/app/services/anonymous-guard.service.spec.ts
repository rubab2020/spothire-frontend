import { TestBed, inject } from '@angular/core/testing';

import { AnonymousGuardService } from './anonymous-guard.service';

describe('AnonymousGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousGuardService]
    });
  });

  it('should be created', inject([AnonymousGuardService], (service: AnonymousGuardService) => {
    expect(service).toBeTruthy();
  }));
});
