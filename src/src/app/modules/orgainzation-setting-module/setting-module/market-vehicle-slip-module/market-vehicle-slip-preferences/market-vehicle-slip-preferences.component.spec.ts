import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketVehicleSlipPreferencesComponent } from './market-vehicle-slip-preferences.component';

describe('MarketVehicleSlipPreferencesComponent', () => {
  let component: MarketVehicleSlipPreferencesComponent;
  let fixture: ComponentFixture<MarketVehicleSlipPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketVehicleSlipPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketVehicleSlipPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
