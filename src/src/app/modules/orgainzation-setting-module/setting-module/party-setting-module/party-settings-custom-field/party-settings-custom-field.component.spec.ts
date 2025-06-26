import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySettingsCustomFieldComponent } from './party-settings-custom-field.component';

describe('PartySettingsCustomFieldComponent', () => {
  let component: PartySettingsCustomFieldComponent;
  let fixture: ComponentFixture<PartySettingsCustomFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartySettingsCustomFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartySettingsCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
