import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsMaintenancePartyInfoComponent } from './party-details-maintenance-party-info.component';

describe('PartyDetailsMaintenancePartyInfoComponent', () => {
  let component: PartyDetailsMaintenancePartyInfoComponent;
  let fixture: ComponentFixture<PartyDetailsMaintenancePartyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsMaintenancePartyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsMaintenancePartyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
