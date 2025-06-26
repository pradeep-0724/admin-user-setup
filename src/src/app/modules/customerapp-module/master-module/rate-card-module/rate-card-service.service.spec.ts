import { TestBed } from '@angular/core/testing';

import { RateCardServiceService } from './rate-card-service.service';

describe('RateCardServiceService', () => {
  let service: RateCardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateCardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
