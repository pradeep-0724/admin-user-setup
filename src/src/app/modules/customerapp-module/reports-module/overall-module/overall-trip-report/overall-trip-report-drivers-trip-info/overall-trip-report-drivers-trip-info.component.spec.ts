import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportDriversTripInfoComponent } from './overall-trip-report-drivers-trip-info.component';

describe('OverallTripReportDriversTripInfoComponent', () => {
  let component: OverallTripReportDriversTripInfoComponent;
  let fixture: ComponentFixture<OverallTripReportDriversTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportDriversTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportDriversTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
