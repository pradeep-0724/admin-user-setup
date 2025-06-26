import { TestBed } from '@angular/core/testing';

import { VehicleInspectionServiceService } from './vehicle-inspection-service.service';

describe('VehicleInspectionServiceService', () => {
  let service: VehicleInspectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleInspectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
