import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsMaintenanceComponent } from './party-details-maintenance.component';

describe('PartyDetailsMaintenanceComponent', () => {
  let component: PartyDetailsMaintenanceComponent;
  let fixture: ComponentFixture<PartyDetailsMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
