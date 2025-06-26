import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectionViewComponent } from './vehicle-inspection-view.component';

describe('VehicleInspectionViewComponent', () => {
  let component: VehicleInspectionViewComponent;
  let fixture: ComponentFixture<VehicleInspectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
