import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeSectionV2Component } from './vehicle-type-section-v2.component';

describe('VehicleTypeSectionV2Component', () => {
  let component: VehicleTypeSectionV2Component;
  let fixture: ComponentFixture<VehicleTypeSectionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleTypeSectionV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypeSectionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
