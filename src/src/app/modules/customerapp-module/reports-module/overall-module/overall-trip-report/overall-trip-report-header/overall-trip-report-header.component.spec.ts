import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTripReportHeaderComponent } from './overall-trip-report-header.component';

describe('OverallTripReportHeaderComponent', () => {
  let component: OverallTripReportHeaderComponent;
  let fixture: ComponentFixture<OverallTripReportHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallTripReportHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallTripReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
