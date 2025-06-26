import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportOverviewComponent } from './overall-trip-report-overview.component';

describe('OverallTripReportOverviewComponent', () => {
  let component: OverallTripReportOverviewComponent;
  let fixture: ComponentFixture<OverallTripReportOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
