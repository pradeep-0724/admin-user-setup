import { TestBed } from '@angular/core/testing';

import { VehicleProviderServiceService } from './vehicle-provider-service.service';

describe('VehicleProviderServiceService', () => {
  let service: VehicleProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
