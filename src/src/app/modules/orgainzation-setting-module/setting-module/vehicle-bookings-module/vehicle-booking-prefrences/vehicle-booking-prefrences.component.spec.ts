import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBookingPrefrencesComponent } from './vehicle-booking-prefrences.component';

describe('VehicleBookingPrefrencesComponent', () => {
  let component: VehicleBookingPrefrencesComponent;
  let fixture: ComponentFixture<VehicleBookingPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBookingPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBookingPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
