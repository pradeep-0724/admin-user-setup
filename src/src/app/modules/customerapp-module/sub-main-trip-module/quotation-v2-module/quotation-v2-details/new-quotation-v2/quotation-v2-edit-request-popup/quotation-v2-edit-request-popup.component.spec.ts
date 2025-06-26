import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2EditRequestPopupComponent } from './quotation-v2-edit-request-popup.component';

describe('QuotationV2EditRequestPopupComponent', () => {
  let component: QuotationV2EditRequestPopupComponent;
  let fixture: ComponentFixture<QuotationV2EditRequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2EditRequestPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2EditRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
