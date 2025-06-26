import { TestBed } from '@angular/core/testing';

import { PettyExpenseService } from './petty-expense.service';

describe('PettyExpenseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PettyExpenseService = TestBed.get(PettyExpenseService);
    expect(service).toBeTruthy();
  });
});
