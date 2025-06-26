import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportClientsTripInfoComponent } from './overall-trip-report-clients-trip-info.component';

describe('OverallTripReportClientsTripInfoComponent', () => {
  let component: OverallTripReportClientsTripInfoComponent;
  let fixture: ComponentFixture<OverallTripReportClientsTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportClientsTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportClientsTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
