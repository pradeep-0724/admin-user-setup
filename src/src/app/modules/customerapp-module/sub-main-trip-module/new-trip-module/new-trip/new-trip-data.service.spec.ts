import { TestBed } from '@angular/core/testing';

import { NewTripDataService } from './new-trip-data.service';

describe('NewTripDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewTripDataService = TestBed.get(NewTripDataService);
    expect(service).toBeTruthy();
  });
});
