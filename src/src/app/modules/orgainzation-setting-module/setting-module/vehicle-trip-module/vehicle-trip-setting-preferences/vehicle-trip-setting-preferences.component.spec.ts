import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTripSettingPreferencesComponent } from './vehicle-trip-setting-preferences.component';

describe('VehicleTripSettingPreferencesComponent', () => {
  let component: VehicleTripSettingPreferencesComponent;
  let fixture: ComponentFixture<VehicleTripSettingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripSettingPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripSettingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
