import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTripSettingPreferencesComponent } from './company-trip-setting-preferences.component';

describe('CompanyTripSettingPreferencesComponent', () => {
  let component: CompanyTripSettingPreferencesComponent;
  let fixture: ComponentFixture<CompanyTripSettingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTripSettingPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTripSettingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
