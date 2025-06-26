import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterTripCustomFieldComponent } from './transporter-trip-custom-field.component';

describe('TransporterTripCustomFieldComponent', () => {
  let component: TransporterTripCustomFieldComponent;
  let fixture: ComponentFixture<TransporterTripCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransporterTripCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterTripCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
