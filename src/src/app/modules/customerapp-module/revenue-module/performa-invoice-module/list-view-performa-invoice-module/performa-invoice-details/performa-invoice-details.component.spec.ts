import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaInvoiceDetailsComponent } from './performa-invoice-details.component';

describe('PerformaInvoiceDetailsComponent', () => {
  let component: PerformaInvoiceDetailsComponent;
  let fixture: ComponentFixture<PerformaInvoiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaInvoiceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
