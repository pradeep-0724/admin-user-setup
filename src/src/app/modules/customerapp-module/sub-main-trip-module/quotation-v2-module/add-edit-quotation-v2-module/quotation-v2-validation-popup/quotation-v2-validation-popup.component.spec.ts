import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2ValidationPopupComponent } from './quotation-v2-validation-popup.component';

describe('QuotationV2ValidationPopupComponent', () => {
  let component: QuotationV2ValidationPopupComponent;
  let fixture: ComponentFixture<QuotationV2ValidationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2ValidationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2ValidationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
