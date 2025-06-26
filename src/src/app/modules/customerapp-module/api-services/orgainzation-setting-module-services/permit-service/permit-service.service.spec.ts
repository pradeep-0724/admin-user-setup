import { TestBed } from '@angular/core/testing';

import { PermitServiceService } from './permit-service.service';

describe('PermitServiceService', () => {
  let service: PermitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
