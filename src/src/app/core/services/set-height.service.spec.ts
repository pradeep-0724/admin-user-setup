import { TestBed } from '@angular/core/testing';

import { SetHeightService } from './set-height.service';

describe('SetHeightService', () => {
  let service: SetHeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetHeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
