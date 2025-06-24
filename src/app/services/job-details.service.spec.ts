import { TestBed, inject } from '@angular/core/testing';

import { JobDetailsService } from './job-details.service';

describe('JobDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobDetailsService]
    });
  });

  it('should be created', inject([JobDetailsService], (service: JobDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
