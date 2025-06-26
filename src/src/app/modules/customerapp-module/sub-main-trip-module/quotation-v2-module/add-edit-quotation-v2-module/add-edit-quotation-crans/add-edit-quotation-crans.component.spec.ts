import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuotationCransComponent } from './add-edit-quotation-crans.component';

describe('AddEditQuotationCransComponent', () => {
  let component: AddEditQuotationCransComponent;
  let fixture: ComponentFixture<AddEditQuotationCransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditQuotationCransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditQuotationCransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
