import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPurchaseOrderSettingComponent } from './local-purchase-order-setting.component';

describe('LocalPurchaseOrderSettingComponent', () => {
  let component: LocalPurchaseOrderSettingComponent;
  let fixture: ComponentFixture<LocalPurchaseOrderSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocalPurchaseOrderSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalPurchaseOrderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
