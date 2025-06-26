import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeBankComponent } from './edit-employee-bank.component';

describe('EditEmployeeBankComponent', () => {
  let component: EditEmployeeBankComponent;
  let fixture: ComponentFixture<EditEmployeeBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
