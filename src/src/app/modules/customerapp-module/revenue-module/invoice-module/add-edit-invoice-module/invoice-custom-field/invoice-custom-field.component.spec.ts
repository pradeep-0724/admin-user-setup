import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCustomFieldComponent } from './invoice-custom-field.component';

describe('InvoiceCustomFieldComponent', () => {
  let component: InvoiceCustomFieldComponent;
  let fixture: ComponentFixture<InvoiceCustomFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCustomFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
