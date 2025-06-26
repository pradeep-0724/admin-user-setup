import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripOtherExpenseComponent } from './trip-other-expense.component';

describe('TripOtherExpenseComponent', () => {
  let component: TripOtherExpenseComponent;
  let fixture: ComponentFixture<TripOtherExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripOtherExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripOtherExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
