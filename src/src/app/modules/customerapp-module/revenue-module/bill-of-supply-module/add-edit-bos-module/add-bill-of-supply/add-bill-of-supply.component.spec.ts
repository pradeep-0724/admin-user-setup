import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillOfSupplyComponent } from './add-bill-of-supply.component';

describe('AddBillOfSupplyComponent', () => {
  let component: AddBillOfSupplyComponent;
  let fixture: ComponentFixture<AddBillOfSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillOfSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillOfSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
