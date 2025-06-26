import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHeaderV2Component } from './employee-header-v2.component';

describe('EmployeeHeaderV2Component', () => {
  let component: EmployeeHeaderV2Component;
  let fixture: ComponentFixture<EmployeeHeaderV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeHeaderV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeHeaderV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
