import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsPartyTripSummaryComponent } from './party-details-party-trip-summary.component';

describe('PartyDetailsPartyTripSummaryComponent', () => {
  let component: PartyDetailsPartyTripSummaryComponent;
  let fixture: ComponentFixture<PartyDetailsPartyTripSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsPartyTripSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsPartyTripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
