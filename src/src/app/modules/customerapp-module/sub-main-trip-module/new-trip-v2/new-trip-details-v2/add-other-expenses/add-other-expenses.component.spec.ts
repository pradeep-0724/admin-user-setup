import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherExpensesComponent } from './add-other-expenses.component';

describe('AddOtherExpensesComponent', () => {
  let component: AddOtherExpensesComponent;
  let fixture: ComponentFixture<AddOtherExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOtherExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOtherExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
