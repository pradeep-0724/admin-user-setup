import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketVehicleSlipCustomFieldComponent } from './market-vehicle-slip-custom-field.component';

describe('MarketVehicleSlipCustomFieldComponent', () => {
  let component: MarketVehicleSlipCustomFieldComponent;
  let fixture: ComponentFixture<MarketVehicleSlipCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketVehicleSlipCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketVehicleSlipCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
