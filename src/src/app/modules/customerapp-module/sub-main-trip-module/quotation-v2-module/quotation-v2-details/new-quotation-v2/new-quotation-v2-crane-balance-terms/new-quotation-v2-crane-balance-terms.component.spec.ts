import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2CraneBalanceTermsComponent } from './new-quotation-v2-crane-balance-terms.component';

describe('NewQuotationV2CraneBalanceTermsComponent', () => {
  let component: NewQuotationV2CraneBalanceTermsComponent;
  let fixture: ComponentFixture<NewQuotationV2CraneBalanceTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2CraneBalanceTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2CraneBalanceTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
