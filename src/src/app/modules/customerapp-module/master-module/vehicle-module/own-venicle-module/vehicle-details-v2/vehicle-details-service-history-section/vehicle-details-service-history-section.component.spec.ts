import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsServiceHistorySectionComponent } from './vehicle-details-service-history-section.component';

describe('VehicleDetailsServiceHistorySectionComponent', () => {
  let component: VehicleDetailsServiceHistorySectionComponent;
  let fixture: ComponentFixture<VehicleDetailsServiceHistorySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsServiceHistorySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsServiceHistorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
