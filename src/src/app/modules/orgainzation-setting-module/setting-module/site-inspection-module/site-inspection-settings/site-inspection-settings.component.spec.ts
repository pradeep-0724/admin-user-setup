import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInspectionSettingsComponent } from './site-inspection-settings.component';

describe('SiteInspectionSettingsComponent', () => {
  let component: SiteInspectionSettingsComponent;
  let fixture: ComponentFixture<SiteInspectionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteInspectionSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteInspectionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
