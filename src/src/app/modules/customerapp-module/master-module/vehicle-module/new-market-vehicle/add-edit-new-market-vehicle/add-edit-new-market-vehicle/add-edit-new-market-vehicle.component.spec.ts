import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNewMarketVehicleComponent } from './add-edit-new-market-vehicle.component';

describe('AddEditNewMarketVehicleComponent', () => {
  let component: AddEditNewMarketVehicleComponent;
  let fixture: ComponentFixture<AddEditNewMarketVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditNewMarketVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditNewMarketVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
