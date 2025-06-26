import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByCustomerReportComponent } from './sales-by-customer-report.component';

describe('SalesByCustomerReportComponent', () => {
  let component: SalesByCustomerReportComponent;
  let fixture: ComponentFixture<SalesByCustomerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesByCustomerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
