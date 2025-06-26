import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRateCardComponent } from './customer-rate-card.component';

describe('CustomerRateCardComponent', () => {
  let component: CustomerRateCardComponent;
  let fixture: ComponentFixture<CustomerRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerRateCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
