import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsHeaderSectionComponent } from './vehicle-details-header-section.component';

describe('VehicleDetailsHeaderSectionComponent', () => {
  let component: VehicleDetailsHeaderSectionComponent;
  let fixture: ComponentFixture<VehicleDetailsHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsHeaderSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
