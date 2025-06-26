import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverExpiryComponent } from './driver-expiry.component';

describe('DriverExpiryComponent', () => {
  let component: DriverExpiryComponent;
  let fixture: ComponentFixture<DriverExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
