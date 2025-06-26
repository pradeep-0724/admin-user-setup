import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOverViewV2Component } from './employee-over-view-v2.component';

describe('EmployeeOverViewV2Component', () => {
  let component: EmployeeOverViewV2Component;
  let fixture: ComponentFixture<EmployeeOverViewV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOverViewV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeOverViewV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
