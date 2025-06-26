import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimelogV2Component } from './employee-timelog-v2.component';

describe('EmployeeTimelogV2Component', () => {
  let component: EmployeeTimelogV2Component;
  let fixture: ComponentFixture<EmployeeTimelogV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTimelogV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTimelogV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
