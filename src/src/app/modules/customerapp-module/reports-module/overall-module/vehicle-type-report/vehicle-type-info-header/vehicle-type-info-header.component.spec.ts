import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTypeInfoHeaderComponent } from './vehicle-type-info-header.component';

describe('VehicleTypeInfoHeaderComponent', () => {
  let component: VehicleTypeInfoHeaderComponent;
  let fixture: ComponentFixture<VehicleTypeInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleTypeInfoHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTypeInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
