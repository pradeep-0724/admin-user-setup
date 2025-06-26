import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationV2CraneChargeSectionComponent } from './new-quotation-v2-crane-charge-section.component';

describe('NewQuotationV2CraneChargeSectionComponent', () => {
  let component: NewQuotationV2CraneChargeSectionComponent;
  let fixture: ComponentFixture<NewQuotationV2CraneChargeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationV2CraneChargeSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationV2CraneChargeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
