import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeMoneyInOutPopupComponent } from './edit-employee-money-in-out-popup.component';

describe('EditEmployeeMoneyInOutPopupComponent', () => {
  let component: EditEmployeeMoneyInOutPopupComponent;
  let fixture: ComponentFixture<EditEmployeeMoneyInOutPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeMoneyInOutPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeMoneyInOutPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
