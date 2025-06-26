import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVehicleInspectionComponent } from './add-edit-vehicle-inspection.component';

describe('AddEditVehicleInspectionComponent', () => {
  let component: AddEditVehicleInspectionComponent;
  let fixture: ComponentFixture<AddEditVehicleInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVehicleInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVehicleInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
