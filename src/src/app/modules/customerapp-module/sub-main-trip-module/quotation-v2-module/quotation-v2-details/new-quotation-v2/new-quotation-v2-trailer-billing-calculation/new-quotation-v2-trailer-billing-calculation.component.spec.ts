import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2TrailerBillingCalculationComponent } from './new-quotation-v2-trailer-billing-calculation.component';

describe('NewQuotationV2TrailerBillingCalculationComponent', () => {
  let component: NewQuotationV2TrailerBillingCalculationComponent;
  let fixture: ComponentFixture<NewQuotationV2TrailerBillingCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2TrailerBillingCalculationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2TrailerBillingCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
