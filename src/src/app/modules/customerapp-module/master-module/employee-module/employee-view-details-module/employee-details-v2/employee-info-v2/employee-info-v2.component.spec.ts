import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoV2Component } from './employee-info-v2.component';

describe('EmployeeInfoV2Component', () => {
  let component: EmployeeInfoV2Component;
  let fixture: ComponentFixture<EmployeeInfoV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInfoV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeInfoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
