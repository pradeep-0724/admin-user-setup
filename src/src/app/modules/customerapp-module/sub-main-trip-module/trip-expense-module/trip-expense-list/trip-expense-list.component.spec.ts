import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripExpenseListComponent } from './trip-expense-list.component';

describe('TripExpenseListComponent', () => {
  let component: TripExpenseListComponent;
  let fixture: ComponentFixture<TripExpenseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripExpenseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
