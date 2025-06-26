import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTripSettingCustomFiledsComponent } from './vehicle-trip-setting-custom-fileds.component';

describe('CompanyTripSettingCustomFiledsComponent', () => {
  let component: VehicleTripSettingCustomFiledsComponent;
  let fixture: ComponentFixture<VehicleTripSettingCustomFiledsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripSettingCustomFiledsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripSettingCustomFiledsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
