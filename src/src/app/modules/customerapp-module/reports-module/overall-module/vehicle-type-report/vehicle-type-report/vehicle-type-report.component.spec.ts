import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeReportComponent } from './vehicle-type-report.component';

describe('VehicleTypeReportComponent', () => {
  let component: VehicleTypeReportComponent;
  let fixture: ComponentFixture<VehicleTypeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleTypeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
