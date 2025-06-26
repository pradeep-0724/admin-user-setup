import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleFuelChallanComponent } from './add-vehicle-fuel-challan.component';

describe('AddVehicleFuelChallanComponent', () => {
  let component: AddVehicleFuelChallanComponent;
  let fixture: ComponentFixture<AddVehicleFuelChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehicleFuelChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleFuelChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
