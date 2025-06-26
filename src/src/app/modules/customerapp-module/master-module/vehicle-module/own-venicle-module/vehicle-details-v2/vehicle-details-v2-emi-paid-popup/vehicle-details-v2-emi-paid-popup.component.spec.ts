import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsV2EMIPaidPopupComponent } from './vehicle-details-v2-emi-paid-popup.component';

describe('VehicleDetailsV2EMIPaidPopupComponent', () => {
  let component: VehicleDetailsV2EMIPaidPopupComponent;
  let fixture: ComponentFixture<VehicleDetailsV2EMIPaidPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsV2EMIPaidPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsV2EMIPaidPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
