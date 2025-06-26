import { TestBed } from '@angular/core/testing';

import { GenericChecklistServiceService } from './generic-checklist-service.service';

describe('GenericChecklistServiceService', () => {
  let service: GenericChecklistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericChecklistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
