import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFuelExpenseComponent } from './details-fuel-expense.component';

describe('DetailsFuelExpenseComponent', () => {
  let component: DetailsFuelExpenseComponent;
  let fixture: ComponentFixture<DetailsFuelExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsFuelExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFuelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

