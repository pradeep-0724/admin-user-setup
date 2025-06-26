import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionListComponent } from './vehicle-inspection-list.component';

describe('VehicleInspectionListComponent', () => {
  let component: VehicleInspectionListComponent;
  let fixture: ComponentFixture<VehicleInspectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
