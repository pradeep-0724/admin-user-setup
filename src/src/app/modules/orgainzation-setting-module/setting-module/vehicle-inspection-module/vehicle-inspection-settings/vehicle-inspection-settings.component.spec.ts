import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionSettingsComponent } from './vehicle-inspection-settings.component';

describe('VehicleInspectionSettingsComponent', () => {
  let component: VehicleInspectionSettingsComponent;
  let fixture: ComponentFixture<VehicleInspectionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectionSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
