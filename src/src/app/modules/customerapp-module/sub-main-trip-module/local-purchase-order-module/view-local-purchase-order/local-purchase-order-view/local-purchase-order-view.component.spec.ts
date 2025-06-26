import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPurchaseOrderViewComponent } from './local-purchase-order-view.component';

describe('LocalPurchaseOrderViewComponent', () => {
  let component: LocalPurchaseOrderViewComponent;
  let fixture: ComponentFixture<LocalPurchaseOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPurchaseOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalPurchaseOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
