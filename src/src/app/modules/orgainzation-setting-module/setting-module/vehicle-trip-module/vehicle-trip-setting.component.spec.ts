import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripSettingComponent } from './vehicle-trip-setting.component';

describe('VehicleTripSettingComponent', () => {
  let component: VehicleTripSettingComponent;
  let fixture: ComponentFixture<VehicleTripSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
