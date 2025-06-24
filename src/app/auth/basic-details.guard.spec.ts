import { TestBed, async, inject } from '@angular/core/testing';

import { BasicDetailsGuard } from './basic-details.guard';

describe('BasicDetailsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicDetailsGuard]
    });
  });

  it('should ...', inject([BasicDetailsGuard], (guard: BasicDetailsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
