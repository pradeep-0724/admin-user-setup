import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryAdjustmentComponent } from './add-inventory-adjustment.component';

describe('AddInventoryAdjustmentComponent', () => {
  let component: AddInventoryAdjustmentComponent;
  let fixture: ComponentFixture<AddInventoryAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
