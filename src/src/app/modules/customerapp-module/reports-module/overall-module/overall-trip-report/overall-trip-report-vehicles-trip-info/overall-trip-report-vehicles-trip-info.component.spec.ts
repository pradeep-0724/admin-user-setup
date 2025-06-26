import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportVehiclesTripInfoComponent } from './overall-trip-report-vehicles-trip-info.component';

describe('OverallTripReportVehiclesTripInfoComponent', () => {
  let component: OverallTripReportVehiclesTripInfoComponent;
  let fixture: ComponentFixture<OverallTripReportVehiclesTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportVehiclesTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportVehiclesTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
