import { TestBed } from '@angular/core/testing';

import { OverallTripReportService } from './overall-trip-report.service';

describe('OverallTripReportService', () => {
  let service: OverallTripReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverallTripReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
