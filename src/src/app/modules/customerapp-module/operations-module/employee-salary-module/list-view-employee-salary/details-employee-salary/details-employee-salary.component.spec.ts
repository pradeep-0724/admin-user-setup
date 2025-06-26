import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployeeSalaryComponent } from './details-employee-salary.component';

describe('DetailsEmployeeSalaryComponent', () => {
  let component: DetailsEmployeeSalaryComponent;
  let fixture: ComponentFixture<DetailsEmployeeSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEmployeeSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEmployeeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
