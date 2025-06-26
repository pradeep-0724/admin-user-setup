import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2TermsConditionSectionComponent } from './quotation-v2-terms-condition-section.component';

describe('QuotationV2TermsConditionSectionComponent', () => {
  let component: QuotationV2TermsConditionSectionComponent;
  let fixture: ComponentFixture<QuotationV2TermsConditionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2TermsConditionSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2TermsConditionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
