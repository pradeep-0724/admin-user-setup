import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAgainstCustomFieldComponent } from './payment-against-custom-field.component';

describe('PaymentAgainstCustomFieldComponent', () => {
  let component: PaymentAgainstCustomFieldComponent;
  let fixture: ComponentFixture<PaymentAgainstCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAgainstCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAgainstCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
