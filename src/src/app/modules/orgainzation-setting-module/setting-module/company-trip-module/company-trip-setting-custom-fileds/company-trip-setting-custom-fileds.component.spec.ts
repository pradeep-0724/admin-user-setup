import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTripSettingCustomFiledsComponent } from './company-trip-setting-custom-fileds.component';

describe('CompanyTripSettingCustomFiledsComponent', () => {
  let component: CompanyTripSettingCustomFiledsComponent;
  let fixture: ComponentFixture<CompanyTripSettingCustomFiledsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTripSettingCustomFiledsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTripSettingCustomFiledsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
