import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2PdfComponent } from './quotation-v2-pdf.component';

describe('QuotationV2PdfComponent', () => {
  let component: QuotationV2PdfComponent;
  let fixture: ComponentFixture<QuotationV2PdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2PdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2PdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
