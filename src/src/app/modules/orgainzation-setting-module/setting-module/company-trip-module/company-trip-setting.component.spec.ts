import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTripSettingComponent } from './company-trip-setting.component';

describe('CompanyTripSettingComponent', () => {
  let component: CompanyTripSettingComponent;
  let fixture: ComponentFixture<CompanyTripSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTripSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTripSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
