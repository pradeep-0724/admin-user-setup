import { TestBed } from '@angular/core/testing';

import { VehiclePermitService } from './vehicle-permit.service';

describe('VehiclePermitService', () => {
  let service: VehiclePermitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclePermitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
