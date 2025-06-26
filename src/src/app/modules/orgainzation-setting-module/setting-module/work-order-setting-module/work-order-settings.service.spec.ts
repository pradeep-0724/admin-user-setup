import { TestBed } from '@angular/core/testing';

import { WorkOrderSettingsService } from './work-order-settings.service';

describe('WorkOrderSettingsService', () => {
  let service: WorkOrderSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOrderSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
