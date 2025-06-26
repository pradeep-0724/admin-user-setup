import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyVehicleProviderTransactionsComponent } from './party-vehicle-provider-transactions.component';

describe('PartyVehicleProviderTransactionsComponent', () => {
  let component: PartyVehicleProviderTransactionsComponent;
  let fixture: ComponentFixture<PartyVehicleProviderTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyVehicleProviderTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyVehicleProviderTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
