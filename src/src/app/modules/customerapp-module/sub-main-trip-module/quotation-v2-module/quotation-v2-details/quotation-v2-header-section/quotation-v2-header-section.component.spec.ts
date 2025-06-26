import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2HeaderSectionComponent } from './quotation-v2-header-section.component';

describe('QuotationV2HeaderSectionComponent', () => {
  let component: QuotationV2HeaderSectionComponent;
  let fixture: ComponentFixture<QuotationV2HeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2HeaderSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2HeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
