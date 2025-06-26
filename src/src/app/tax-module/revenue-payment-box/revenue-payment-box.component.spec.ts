import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuePaymentBoxComponent } from './revenue-payment-box.component';

describe('RevenuePaymentBoxComponent', () => {
  let component: RevenuePaymentBoxComponent;
  let fixture: ComponentFixture<RevenuePaymentBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuePaymentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuePaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
