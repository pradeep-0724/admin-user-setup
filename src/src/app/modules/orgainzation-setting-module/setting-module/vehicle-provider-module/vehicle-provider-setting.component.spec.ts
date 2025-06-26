import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProviderSettingComponent } from './vehicle-provider-setting.component';

describe('VehicleProviderSettingComponent', () => {
  let component: VehicleProviderSettingComponent;
  let fixture: ComponentFixture<VehicleProviderSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleProviderSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleProviderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
