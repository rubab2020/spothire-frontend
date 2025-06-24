import { TestBed, inject } from '@angular/core/testing';

import { WorkDashboardService } from './work-dashboard.service';

describe('WorkDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkDashboardService]
    });
  });

  it('should be created', inject([WorkDashboardService], (service: WorkDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
