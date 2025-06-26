import { TestBed } from '@angular/core/testing';

import { InvoiceCustomFieldService } from './invoice-custom-field.service';

describe('InvoiceCustomFieldService', () => {
  let service: InvoiceCustomFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceCustomFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
