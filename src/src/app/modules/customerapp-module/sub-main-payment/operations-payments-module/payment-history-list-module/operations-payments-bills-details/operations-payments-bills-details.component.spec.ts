import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsPaymentsBillsDetailsComponent } from './operations-payments-bills-details.component';

describe('OperationsPaymentsBillsDetailsComponent', () => {
  let component: OperationsPaymentsBillsDetailsComponent;
  let fixture: ComponentFixture<OperationsPaymentsBillsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsPaymentsBillsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsPaymentsBillsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
