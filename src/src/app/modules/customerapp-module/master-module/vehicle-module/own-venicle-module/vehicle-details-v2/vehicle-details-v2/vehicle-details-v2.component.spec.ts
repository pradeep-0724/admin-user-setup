import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsV2Component } from './vehicle-details-v2.component';

describe('VehicleDetailsV2Component', () => {
  let component: VehicleDetailsV2Component;
  let fixture: ComponentFixture<VehicleDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
