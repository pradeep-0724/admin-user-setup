import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2ApproveRejectPopupComponent } from './quotation-v2-approve-reject-popup.component';

describe('QuotationV2ApproveRejectPopupComponent', () => {
  let component: QuotationV2ApproveRejectPopupComponent;
  let fixture: ComponentFixture<QuotationV2ApproveRejectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2ApproveRejectPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2ApproveRejectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
