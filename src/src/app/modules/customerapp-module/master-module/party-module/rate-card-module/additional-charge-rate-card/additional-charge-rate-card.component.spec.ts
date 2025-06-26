import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargeRateCardComponent } from './additional-charge-rate-card.component';

describe('AdditionalChargeRateCardComponent', () => {
  let component: AdditionalChargeRateCardComponent;
  let fixture: ComponentFixture<AdditionalChargeRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargeRateCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalChargeRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
