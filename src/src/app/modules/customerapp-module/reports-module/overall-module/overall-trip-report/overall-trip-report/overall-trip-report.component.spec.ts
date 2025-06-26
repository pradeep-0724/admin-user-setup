import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportComponent } from './overall-trip-report.component';

describe('OverallTripReportComponent', () => {
  let component: OverallTripReportComponent;
  let fixture: ComponentFixture<OverallTripReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
