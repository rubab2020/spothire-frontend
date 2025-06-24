import { TestBed, inject } from '@angular/core/testing';

import { HireDashboardService } from './hire-dashboard.service';

describe('HireDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HireDashboardService]
    });
  });

  it('should be created', inject([HireDashboardService], (service: HireDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
