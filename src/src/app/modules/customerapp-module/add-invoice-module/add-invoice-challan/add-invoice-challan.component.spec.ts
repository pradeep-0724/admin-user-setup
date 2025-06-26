import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceChallanComponent } from './add-invoice-challan.component';

describe('AddInvoiceChallanComponent', () => {
  let component: AddInvoiceChallanComponent;
  let fixture: ComponentFixture<AddInvoiceChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInvoiceChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvoiceChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
