import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsTripHistoryComponent } from './vehicle-details-trip-history.component';

describe('VehicleDetailsTripHistoryComponent', () => {
  let component: VehicleDetailsTripHistoryComponent;
  let fixture: ComponentFixture<VehicleDetailsTripHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsTripHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsTripHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
