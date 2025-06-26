import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationTemplateTrailerComponent } from './quotation-template-trailer.component';

describe('QuotationTemplateTrailerComponent', () => {
  let component: QuotationTemplateTrailerComponent;
  let fixture: ComponentFixture<QuotationTemplateTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationTemplateTrailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationTemplateTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
