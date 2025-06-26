import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReduceFromInvoiceComponent } from './add-edit-reduce-from-invoice.component';

describe('AddEditReduceFromInvoiceComponent', () => {
  let component: AddEditReduceFromInvoiceComponent;
  let fixture: ComponentFixture<AddEditReduceFromInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditReduceFromInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditReduceFromInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
