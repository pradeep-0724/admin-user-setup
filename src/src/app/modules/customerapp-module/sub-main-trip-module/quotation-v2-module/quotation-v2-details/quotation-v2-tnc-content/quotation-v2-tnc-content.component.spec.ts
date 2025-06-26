import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2TncContentComponent } from './quotation-v2-tnc-content.component';

describe('QuotationV2TncContentComponent', () => {
  let component: QuotationV2TncContentComponent;
  let fixture: ComponentFixture<QuotationV2TncContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2TncContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2TncContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
