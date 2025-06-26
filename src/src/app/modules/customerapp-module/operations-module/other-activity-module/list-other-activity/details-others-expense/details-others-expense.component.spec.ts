import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOthersExpenseComponent } from './details-others-expense.component';

describe('DetailsOthersExpenseComponent', () => {
  let component: DetailsOthersExpenseComponent;
  let fixture: ComponentFixture<DetailsOthersExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsOthersExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsOthersExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
