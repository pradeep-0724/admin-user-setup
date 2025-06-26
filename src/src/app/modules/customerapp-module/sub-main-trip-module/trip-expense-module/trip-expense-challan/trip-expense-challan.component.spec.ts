import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripExpenseChallanComponent } from './trip-expense-challan.component';

describe('TripExpenseChallanComponent', () => {
  let component: TripExpenseChallanComponent;
  let fixture: ComponentFixture<TripExpenseChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripExpenseChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripExpenseChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
