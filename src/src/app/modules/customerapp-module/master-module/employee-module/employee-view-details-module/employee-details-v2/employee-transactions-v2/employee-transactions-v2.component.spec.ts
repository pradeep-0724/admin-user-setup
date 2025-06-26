import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransactionsV2Component } from './employee-transactions-v2.component';

describe('EmployeeTransactionsV2Component', () => {
  let component: EmployeeTransactionsV2Component;
  let fixture: ComponentFixture<EmployeeTransactionsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTransactionsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransactionsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
