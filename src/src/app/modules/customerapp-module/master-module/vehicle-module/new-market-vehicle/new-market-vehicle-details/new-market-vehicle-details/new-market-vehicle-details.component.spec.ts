import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketVehicleDetailsComponent } from './new-market-vehicle-details.component';

describe('NewMarketVehicleDetailsComponent', () => {
  let component: NewMarketVehicleDetailsComponent;
  let fixture: ComponentFixture<NewMarketVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
