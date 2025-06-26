import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsTermsConditionComponent } from './invoice-details-terms-condition.component';

describe('InvoiceDetailsTermsConditionComponent', () => {
  let component: InvoiceDetailsTermsConditionComponent;
  let fixture: ComponentFixture<InvoiceDetailsTermsConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsTermsConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsTermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
