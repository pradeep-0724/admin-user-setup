import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsOverViewSectionComponent } from './vehicle-details-over-view-section.component';

describe('VehicleDetailsOverViewSectionComponent', () => {
  let component: VehicleDetailsOverViewSectionComponent;
  let fixture: ComponentFixture<VehicleDetailsOverViewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsOverViewSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsOverViewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
