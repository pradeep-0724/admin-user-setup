import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAssetSettingsComponent } from './own-asset-settings.component';

describe('OwnAssetSettingsComponent', () => {
  let component: OwnAssetSettingsComponent;
  let fixture: ComponentFixture<OwnAssetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnAssetSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnAssetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
