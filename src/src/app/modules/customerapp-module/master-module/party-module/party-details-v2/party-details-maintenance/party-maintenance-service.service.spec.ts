import { TestBed } from '@angular/core/testing';

import { PartyMaintenanceServiceService } from './party-maintenance-service.service';

describe('PartyMaintenanceServiceService', () => {
  let service: PartyMaintenanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyMaintenanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
