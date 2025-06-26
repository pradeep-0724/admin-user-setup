import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaInvoiceComponent } from './performa-invoice.component';

describe('PerformaInvoiceComponent', () => {
  let component: PerformaInvoiceComponent;
  let fixture: ComponentFixture<PerformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
