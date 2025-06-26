import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAddToInvoiceComponent } from './add-edit-add-to-invoice.component';

describe('AddEditAddToInvoiceComponent', () => {
  let component: AddEditAddToInvoiceComponent;
  let fixture: ComponentFixture<AddEditAddToInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAddToInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAddToInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
