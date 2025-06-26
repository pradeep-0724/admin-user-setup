import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionCustomFieldsComponent } from './vehicle-inspection-custom-fields.component';

describe('VehicleInspectionCustomFieldsComponent', () => {
  let component: VehicleInspectionCustomFieldsComponent;
  let fixture: ComponentFixture<VehicleInspectionCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectionCustomFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectionCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
