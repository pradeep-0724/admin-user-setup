import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAssetsOwnVehicleComponent } from './sub-assets-own-vehicle.component';

describe('SubAssetsOwnVehicleComponent', () => {
  let component: SubAssetsOwnVehicleComponent;
  let fixture: ComponentFixture<SubAssetsOwnVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAssetsOwnVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAssetsOwnVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
