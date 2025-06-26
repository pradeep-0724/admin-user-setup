import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2CalculationSectionComponent } from './quotation-v2-calculation-section.component';

describe('QuotationV2CalculationSectionComponent', () => {
  let component: QuotationV2CalculationSectionComponent;
  let fixture: ComponentFixture<QuotationV2CalculationSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2CalculationSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2CalculationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
