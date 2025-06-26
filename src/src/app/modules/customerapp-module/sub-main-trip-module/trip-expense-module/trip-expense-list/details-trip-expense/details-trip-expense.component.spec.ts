import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTripExpenseComponent } from './details-trip-expense.component';

describe('DetailsTripExpenseComponent', () => {
  let component: DetailsTripExpenseComponent;
  let fixture: ComponentFixture<DetailsTripExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTripExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTripExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
