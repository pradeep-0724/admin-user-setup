import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionPreferenceComponent } from './vehicle-inspection-preference.component';

describe('VehicleInspectionPreferenceComponent', () => {
  let component: VehicleInspectionPreferenceComponent;
  let fixture: ComponentFixture<VehicleInspectionPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectionPreferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectionPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
