import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2VoidPopupComponent } from './quotation-v2-void-popup.component';

describe('QuotationV2VoidPopupComponent', () => {
  let component: QuotationV2VoidPopupComponent;
  let fixture: ComponentFixture<QuotationV2VoidPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2VoidPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2VoidPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
