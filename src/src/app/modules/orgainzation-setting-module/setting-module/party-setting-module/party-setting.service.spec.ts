import { TestBed } from '@angular/core/testing';

import { PartySettingService } from './party-setting.service';

describe('PartySettingService', () => {
  let service: PartySettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartySettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
