import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimelogComponent } from './employee-timelog.component';

describe('EmployeeTimelogComponent', () => {
  let component: EmployeeTimelogComponent;
  let fixture: ComponentFixture<EmployeeTimelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTimelogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTimelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
