import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFuelExpensesComponent } from './trip-fuel-expenses.component';

describe('TripFuelExpensesComponent', () => {
  let component: TripFuelExpensesComponent;
  let fixture: ComponentFixture<TripFuelExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripFuelExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripFuelExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
