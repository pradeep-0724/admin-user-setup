import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPettyExpenseComponent } from './view-petty-expense.component';

describe('ViewPettyExpenseComponent', () => {
  let component: ViewPettyExpenseComponent;
  let fixture: ComponentFixture<ViewPettyExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPettyExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPettyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
