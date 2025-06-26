import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusPurchaseOrderComponent } from './change-status-purchase-order.component';

describe('ChangeStatusPurchaseOrderComponent', () => {
  let component: ChangeStatusPurchaseOrderComponent;
  let fixture: ComponentFixture<ChangeStatusPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStatusPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
