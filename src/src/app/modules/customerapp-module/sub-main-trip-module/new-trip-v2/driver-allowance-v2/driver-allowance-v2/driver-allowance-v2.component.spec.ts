import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAllowanceV2Component } from './driver-allowance-v2.component';

describe('DriverAllowanceV2Component', () => {
  let component: DriverAllowanceV2Component;
  let fixture: ComponentFixture<DriverAllowanceV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverAllowanceV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverAllowanceV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
