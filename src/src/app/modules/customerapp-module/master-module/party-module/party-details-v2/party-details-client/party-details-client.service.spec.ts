import { TestBed } from '@angular/core/testing';

import { PartyDetailsClientService } from './party-details-client.service';

describe('PartyDetailsClientService', () => {
  let service: PartyDetailsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartyDetailsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
