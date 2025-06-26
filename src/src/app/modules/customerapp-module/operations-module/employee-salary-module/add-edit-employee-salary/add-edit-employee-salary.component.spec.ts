import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeSalaryComponent } from './add-edit-employee-salary.component';

describe('AddEditEmployeeSalaryComponent', () => {
  let component: AddEditEmployeeSalaryComponent;
  let fixture: ComponentFixture<AddEditEmployeeSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEmployeeSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
