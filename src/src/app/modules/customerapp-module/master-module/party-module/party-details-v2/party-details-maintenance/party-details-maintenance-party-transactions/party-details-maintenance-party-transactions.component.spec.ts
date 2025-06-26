import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsMaintenancePartyTransactionsComponent } from './party-details-maintenance-party-transactions.component';

describe('PartyDetailsMaintenancePartyTransactionsComponent', () => {
  let component: PartyDetailsMaintenancePartyTransactionsComponent;
  let fixture: ComponentFixture<PartyDetailsMaintenancePartyTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsMaintenancePartyTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsMaintenancePartyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
