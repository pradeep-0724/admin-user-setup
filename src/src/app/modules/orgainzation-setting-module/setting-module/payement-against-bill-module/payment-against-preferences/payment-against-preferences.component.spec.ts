import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAgainstPreferencesComponent } from './payment-against-preferences.component';

describe('PaymentAgainstPreferencesComponent', () => {
  let component: PaymentAgainstPreferencesComponent;
  let fixture: ComponentFixture<PaymentAgainstPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAgainstPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAgainstPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
