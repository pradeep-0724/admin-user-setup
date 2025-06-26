import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripExpenseComponent } from './trip-expense.component';

describe('TripExpenseComponent', () => {
  let component: TripExpenseComponent;
  let fixture: ComponentFixture<TripExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
