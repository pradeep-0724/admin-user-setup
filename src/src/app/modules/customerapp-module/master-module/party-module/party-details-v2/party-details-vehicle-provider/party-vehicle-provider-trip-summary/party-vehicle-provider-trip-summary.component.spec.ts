import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyVehicleProviderTripSummaryComponent } from './party-vehicle-provider-trip-summary.component';

describe('PartyVehicleProviderTripSummaryComponent', () => {
  let component: PartyVehicleProviderTripSummaryComponent;
  let fixture: ComponentFixture<PartyVehicleProviderTripSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyVehicleProviderTripSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyVehicleProviderTripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
