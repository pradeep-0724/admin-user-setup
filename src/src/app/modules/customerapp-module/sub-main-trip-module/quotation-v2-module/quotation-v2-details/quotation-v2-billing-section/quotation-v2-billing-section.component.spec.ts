import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2BillingSectionComponent } from './quotation-v2-billing-section.component';

describe('QuotationV2BillingSectionComponent', () => {
  let component: QuotationV2BillingSectionComponent;
  let fixture: ComponentFixture<QuotationV2BillingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2BillingSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2BillingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
