import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderSettingComponent } from './purchase-order-setting.component';

describe('PurchaseOrderSettingComponent', () => {
  let component: PurchaseOrderSettingComponent;
  let fixture: ComponentFixture<PurchaseOrderSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
