import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPurchaseOrderComponent } from './local-purchase-order.component';

describe('LocalPurchaseOrderComponent', () => {
  let component: LocalPurchaseOrderComponent;
  let fixture: ComponentFixture<LocalPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPurchaseOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
