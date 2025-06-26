import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPettyExpenseComponent } from './details-petty-expense.component';

describe('DetailsPettyExpenseComponent', () => {
  let component: DetailsPettyExpenseComponent;
  let fixture: ComponentFixture<DetailsPettyExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPettyExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPettyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
