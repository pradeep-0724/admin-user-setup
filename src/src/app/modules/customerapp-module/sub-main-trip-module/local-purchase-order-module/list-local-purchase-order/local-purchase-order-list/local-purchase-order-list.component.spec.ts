import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPurchaseOrderListComponent } from './local-purchase-order-list.component';

describe('LocalPurchaseOrderListComponent', () => {
  let component: LocalPurchaseOrderListComponent;
  let fixture: ComponentFixture<LocalPurchaseOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPurchaseOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalPurchaseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
