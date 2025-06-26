import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuePaymentComponent } from './revenue-payment.component';

describe('RevenuePaymentComponent', () => {
  let component: RevenuePaymentComponent;
  let fixture: ComponentFixture<RevenuePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
