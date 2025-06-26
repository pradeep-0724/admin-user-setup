import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitSectionOwnVehicleComponent } from './permit-section-own-vehicle.component';

describe('PermitSectionOwnVehicleComponent', () => {
  let component: PermitSectionOwnVehicleComponent;
  let fixture: ComponentFixture<PermitSectionOwnVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitSectionOwnVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitSectionOwnVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
