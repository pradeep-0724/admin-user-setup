import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddEditPermitComponent } from './vehicle-add-edit-permit.component';

describe('VehicleAddEditPermitComponent', () => {
  let component: VehicleAddEditPermitComponent;
  let fixture: ComponentFixture<VehicleAddEditPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleAddEditPermitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAddEditPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
