import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFleetOwnerExpensesComponent } from './list-fleet-owner-expenses.component';

describe('ListFleetOwnerExpensesComponent', () => {
  let component: ListFleetOwnerExpensesComponent;
  let fixture: ComponentFixture<ListFleetOwnerExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFleetOwnerExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFleetOwnerExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
