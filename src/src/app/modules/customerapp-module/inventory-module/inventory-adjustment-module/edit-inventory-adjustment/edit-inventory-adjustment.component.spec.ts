import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryAdjustmentComponent } from './edit-inventory-adjustment.component';

describe('EditInventoryAdjustmentComponent', () => {
  let component: EditInventoryAdjustmentComponent;
  let fixture: ComponentFixture<EditInventoryAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInventoryAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
