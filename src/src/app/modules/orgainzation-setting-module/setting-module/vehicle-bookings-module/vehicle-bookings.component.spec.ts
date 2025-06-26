import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBookingsComponent } from './vehicle-bookings.component';

describe('VehicleBookingComponent', () => {
  let component: VehicleBookingsComponent;
  let fixture: ComponentFixture<VehicleBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
