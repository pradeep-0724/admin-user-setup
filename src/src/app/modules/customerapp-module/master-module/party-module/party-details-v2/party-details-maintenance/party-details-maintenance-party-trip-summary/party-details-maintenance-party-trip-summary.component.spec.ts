import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsMaintenancePartyTripSummaryComponent } from './party-details-maintenance-party-trip-summary.component';

describe('PartyDetailsMaintenancePartyTripSummaryComponent', () => {
  let component: PartyDetailsMaintenancePartyTripSummaryComponent;
  let fixture: ComponentFixture<PartyDetailsMaintenancePartyTripSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsMaintenancePartyTripSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsMaintenancePartyTripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
