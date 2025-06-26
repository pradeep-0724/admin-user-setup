import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfSupplyCustomFieldComponent } from './bill-of-supply-custom-field.component';

describe('BillOfSupplyCustomFieldComponent', () => {
  let component: BillOfSupplyCustomFieldComponent;
  let fixture: ComponentFixture<BillOfSupplyCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillOfSupplyCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfSupplyCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
