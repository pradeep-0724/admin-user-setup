import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVendorPreferencesComponent } from './payment-vendor-preferences.component';

describe('PaymentVendorPreferencesComponent', () => {
  let component: PaymentVendorPreferencesComponent;
  let fixture: ComponentFixture<PaymentVendorPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVendorPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVendorPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
