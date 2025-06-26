import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarketVehicleListComponent } from './new-market-vehicle-list.component';

describe('NewMarketVehicleListComponent', () => {
  let component: NewMarketVehicleListComponent;
  let fixture: ComponentFixture<NewMarketVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMarketVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMarketVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
