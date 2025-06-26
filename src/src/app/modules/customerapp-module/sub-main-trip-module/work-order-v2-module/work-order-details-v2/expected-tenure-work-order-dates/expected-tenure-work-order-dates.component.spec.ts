import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedTenureWorkOrderDatesComponent } from './expected-tenure-work-order-dates.component';

describe('ExpectedTenureWorkOrderDatesComponent', () => {
  let component: ExpectedTenureWorkOrderDatesComponent;
  let fixture: ComponentFixture<ExpectedTenureWorkOrderDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectedTenureWorkOrderDatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedTenureWorkOrderDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
