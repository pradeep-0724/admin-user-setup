import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentBoxComponent } from './advance-payment-box.component';

describe('AdvancePaymentBoxComponent', () => {
  let component: AdvancePaymentBoxComponent;
  let fixture: ComponentFixture<AdvancePaymentBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePaymentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
