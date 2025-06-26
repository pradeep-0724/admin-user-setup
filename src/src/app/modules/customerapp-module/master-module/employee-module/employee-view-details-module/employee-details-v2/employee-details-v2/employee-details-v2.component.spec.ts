import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsV2Component } from './employee-details-v2.component';

describe('EmployeeDetailsV2Component', () => {
  let component: EmployeeDetailsV2Component;
  let fixture: ComponentFixture<EmployeeDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
