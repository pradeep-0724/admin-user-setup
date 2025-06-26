import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketVehicleSlipSettingsComponent } from './market-vehicle-slip-settings.component';

describe('MarketVehicleSlipSettingsComponent', () => {
  let component: MarketVehicleSlipSettingsComponent;
  let fixture: ComponentFixture<MarketVehicleSlipSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketVehicleSlipSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketVehicleSlipSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
