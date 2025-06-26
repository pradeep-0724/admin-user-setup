import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsFuelHistorySectionComponent } from './vehicle-details-fuel-history-section.component';

describe('VehicleDetailsFuelHistorySectionComponent', () => {
  let component: VehicleDetailsFuelHistorySectionComponent;
  let fixture: ComponentFixture<VehicleDetailsFuelHistorySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsFuelHistorySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsFuelHistorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
