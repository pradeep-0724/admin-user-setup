import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2ViewApprovalDetailsComponent } from './quotation-v2-view-approval-details.component';

describe('QuotationV2ViewApprovalDetailsComponent', () => {
  let component: QuotationV2ViewApprovalDetailsComponent;
  let fixture: ComponentFixture<QuotationV2ViewApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2ViewApprovalDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2ViewApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
