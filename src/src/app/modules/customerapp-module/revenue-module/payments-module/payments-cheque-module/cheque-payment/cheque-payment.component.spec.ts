import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequePaymentComponent } from './cheque-payment.component';

describe('ChequePaymentComponent', () => {
  let component: ChequePaymentComponent;
  let fixture: ComponentFixture<ChequePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
