import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationAddEditCustomColumnComponent } from './quotation-add-edit-custom-column.component';

describe('QuotationAddEditCustomColumnComponent', () => {
  let component: QuotationAddEditCustomColumnComponent;
  let fixture: ComponentFixture<QuotationAddEditCustomColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationAddEditCustomColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationAddEditCustomColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
