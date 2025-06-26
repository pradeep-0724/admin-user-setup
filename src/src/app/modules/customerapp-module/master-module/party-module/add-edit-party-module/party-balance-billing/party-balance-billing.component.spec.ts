import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyBalanceBillingComponent } from './party-balance-billing.component';

describe('PartyBalanceBillingComponent', () => {
  let component: PartyBalanceBillingComponent;
  let fixture: ComponentFixture<PartyBalanceBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyBalanceBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyBalanceBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
