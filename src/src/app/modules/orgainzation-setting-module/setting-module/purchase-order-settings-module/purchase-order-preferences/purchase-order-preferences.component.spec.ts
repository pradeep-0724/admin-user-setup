import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderPreferencesComponent } from './purchase-order-preferences.component';

describe('PurchaseOrderPreferencesComponent', () => {
  let component: PurchaseOrderPreferencesComponent;
  let fixture: ComponentFixture<PurchaseOrderPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
