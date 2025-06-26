import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterTripCustomPreferencesComponent } from './transporter-trip-custom-preferences.component';

describe('TransporterTripCustomPreferencesComponent', () => {
  let component: TransporterTripCustomPreferencesComponent;
  let fixture: ComponentFixture<TransporterTripCustomPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporterTripCustomPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterTripCustomPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
