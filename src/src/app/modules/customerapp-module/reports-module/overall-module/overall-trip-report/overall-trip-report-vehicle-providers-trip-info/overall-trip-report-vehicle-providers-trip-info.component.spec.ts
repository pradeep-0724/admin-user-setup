import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportVehicleProvidersTripInfoComponent } from './overall-trip-report-vehicle-providers-trip-info.component';

describe('OverallTripReportVehicleProvidersTripInfoComponent', () => {
  let component: OverallTripReportVehicleProvidersTripInfoComponent;
  let fixture: ComponentFixture<OverallTripReportVehicleProvidersTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportVehicleProvidersTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportVehicleProvidersTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
