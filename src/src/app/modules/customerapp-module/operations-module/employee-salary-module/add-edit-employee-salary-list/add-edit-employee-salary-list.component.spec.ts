import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeSalaryListComponent } from './add-edit-employee-salary-list.component';

describe('AddEditEmployeeSalaryListComponent', () => {
  let component: AddEditEmployeeSalaryListComponent;
  let fixture: ComponentFixture<AddEditEmployeeSalaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEmployeeSalaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEmployeeSalaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
