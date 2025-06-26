import { TestBed } from '@angular/core/testing';

import { PartyDetailsVendorCommonServiceService } from './party-details-vendor-common-service.service';

describe('PartyDetailsVendorCommonServiceService', () => {
  let service: PartyDetailsVendorCommonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyDetailsVendorCommonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
