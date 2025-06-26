import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVendorCustomFieldComponent } from './payment-vendor-custom-field.component';

describe('PaymentVendorCustomFieldComponent', () => {
  let component: PaymentVendorCustomFieldComponent;
  let fixture: ComponentFixture<PaymentVendorCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVendorCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVendorCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
