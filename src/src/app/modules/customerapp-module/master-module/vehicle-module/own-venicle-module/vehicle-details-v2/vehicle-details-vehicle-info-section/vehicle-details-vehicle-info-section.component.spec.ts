import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsVehicleInfoSectionComponent } from './vehicle-details-vehicle-info-section.component';

describe('VehicleDetailsVehicleInfoSectionComponent', () => {
  let component: VehicleDetailsVehicleInfoSectionComponent;
  let fixture: ComponentFixture<VehicleDetailsVehicleInfoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsVehicleInfoSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsVehicleInfoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
