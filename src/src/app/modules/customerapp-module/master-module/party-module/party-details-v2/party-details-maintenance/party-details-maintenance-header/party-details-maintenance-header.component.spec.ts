import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsMaintenanceHeaderComponent } from './party-details-maintenance-header.component';

describe('PartyDetailsMaintenanceHeaderComponent', () => {
  let component: PartyDetailsMaintenanceHeaderComponent;
  let fixture: ComponentFixture<PartyDetailsMaintenanceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsMaintenanceHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsMaintenanceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
