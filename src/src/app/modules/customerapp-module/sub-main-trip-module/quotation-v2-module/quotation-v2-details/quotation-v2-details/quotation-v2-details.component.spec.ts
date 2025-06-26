import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationV2DetailsComponent } from './quotation-v2-details.component';

describe('QuotationV2DetailsComponent', () => {
  let component: QuotationV2DetailsComponent;
  let fixture: ComponentFixture<QuotationV2DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationV2DetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationV2DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
