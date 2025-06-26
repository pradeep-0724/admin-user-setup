import { TestBed } from '@angular/core/testing';

import { TaxModuleServiceService } from './tax-module-service.service';

describe('TaxModuleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxModuleServiceService = TestBed.get(TaxModuleServiceService);
    expect(service).toBeTruthy();
  });
});
