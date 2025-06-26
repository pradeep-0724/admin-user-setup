import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketDetailsVehicleInfoComponent } from './new-market-details-vehicle-info.component';

describe('NewMarketDetailsVehicleInfoComponent', () => {
  let component: NewMarketDetailsVehicleInfoComponent;
  let fixture: ComponentFixture<NewMarketDetailsVehicleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketDetailsVehicleInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketDetailsVehicleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
