import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuotationV2Component } from './add-edit-quotation-v2.component';

describe('AddEditQuotationV2Component', () => {
  let component: AddEditQuotationV2Component;
  let fixture: ComponentFixture<AddEditQuotationV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditQuotationV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditQuotationV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
