import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketVehicleHeaderDetailsComponent } from './new-market-vehicle-header-details.component';

describe('NewMarketVehicleHeaderDetailsComponent', () => {
  let component: NewMarketVehicleHeaderDetailsComponent;
  let fixture: ComponentFixture<NewMarketVehicleHeaderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketVehicleHeaderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketVehicleHeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
