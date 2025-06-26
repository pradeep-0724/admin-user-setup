import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProviderInfoComponent } from './vehicle-provider-info.component';

describe('VehicleProviderInfoComponent', () => {
  let component: VehicleProviderInfoComponent;
  let fixture: ComponentFixture<VehicleProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleProviderInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
