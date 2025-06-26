import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReportInvoiceComponent } from './aging-report-invoice.component';

describe('AgingReportInvoiceComponent', () => {
  let component: AgingReportInvoiceComponent;
  let fixture: ComponentFixture<AgingReportInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingReportInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingReportInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
