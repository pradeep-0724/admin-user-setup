import { TestBed } from '@angular/core/testing';

import { VehicleTypeReportService } from './vehicle-type-report.service';

describe('VehicleTypeReportService', () => {
  let service: VehicleTypeReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleTypeReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
