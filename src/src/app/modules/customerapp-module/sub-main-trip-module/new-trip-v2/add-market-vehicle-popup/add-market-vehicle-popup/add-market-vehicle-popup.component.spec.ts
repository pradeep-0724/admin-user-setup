import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketVehiclePopupComponent } from './add-market-vehicle-popup.component';

describe('AddMarketVehiclePopupComponent', () => {
  let component: AddMarketVehiclePopupComponent;
  let fixture: ComponentFixture<AddMarketVehiclePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMarketVehiclePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMarketVehiclePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
