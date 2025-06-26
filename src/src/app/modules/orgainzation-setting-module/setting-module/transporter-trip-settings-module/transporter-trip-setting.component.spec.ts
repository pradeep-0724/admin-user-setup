import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterTripSettingComponent } from './transporter-trip-setting.component';

describe('TransporterTripSettingComponent', () => {
  let component: TransporterTripSettingComponent;
  let fixture: ComponentFixture<TransporterTripSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporterTripSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterTripSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
