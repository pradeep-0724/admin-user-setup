import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2TrailerChargeSectionComponent } from './new-quotation-v2-trailer-charge-section.component';

describe('NewQuotationV2TrailerChargeSectionComponent', () => {
  let component: NewQuotationV2TrailerChargeSectionComponent;
  let fixture: ComponentFixture<NewQuotationV2TrailerChargeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2TrailerChargeSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2TrailerChargeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
