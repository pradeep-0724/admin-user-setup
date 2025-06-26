import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTripV2UassignedVehiclesPopupComponent } from './list-trip-v2-uassigned-vehicles-popup.component';

describe('ListTripV2UassignedVehiclesPopupComponent', () => {
  let component: ListTripV2UassignedVehiclesPopupComponent;
  let fixture: ComponentFixture<ListTripV2UassignedVehiclesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTripV2UassignedVehiclesPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTripV2UassignedVehiclesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
