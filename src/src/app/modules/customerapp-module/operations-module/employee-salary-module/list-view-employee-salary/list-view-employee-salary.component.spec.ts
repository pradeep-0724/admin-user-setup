import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewEmployeeSalaryComponent } from './list-view-employee-salary.component';

describe('ListViewEmployeeSalaryComponent', () => {
  let component: ListViewEmployeeSalaryComponent;
  let fixture: ComponentFixture<ListViewEmployeeSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewEmployeeSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
