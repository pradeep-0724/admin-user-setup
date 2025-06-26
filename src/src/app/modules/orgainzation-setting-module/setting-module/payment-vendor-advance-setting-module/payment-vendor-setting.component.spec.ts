import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVendorSettingComponent } from './payment-vendor-setting.component';

describe('PaymentVendorSettingComponent', () => {
  let component: PaymentVendorSettingComponent;
  let fixture: ComponentFixture<PaymentVendorSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVendorSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVendorSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
