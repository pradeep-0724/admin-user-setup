import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAgainstSettingsComponent } from './payment-against-settings.component';

describe('PaymentAgainstSettingsComponent', () => {
  let component: PaymentAgainstSettingsComponent;
  let fixture: ComponentFixture<PaymentAgainstSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAgainstSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAgainstSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
