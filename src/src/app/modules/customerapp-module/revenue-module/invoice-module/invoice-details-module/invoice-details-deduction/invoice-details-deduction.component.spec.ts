import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsDeductionComponent } from './invoice-details-deduction.component';

describe('InvoiceDetailsDeductionComponent', () => {
  let component: InvoiceDetailsDeductionComponent;
  let fixture: ComponentFixture<InvoiceDetailsDeductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsDeductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
