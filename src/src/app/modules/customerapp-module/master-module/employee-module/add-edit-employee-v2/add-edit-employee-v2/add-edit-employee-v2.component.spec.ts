import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeV2Component } from './add-edit-employee-v2.component';

describe('AddEditEmployeeV2Component', () => {
  let component: AddEditEmployeeV2Component;
  let fixture: ComponentFixture<AddEditEmployeeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEmployeeV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmployeeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
