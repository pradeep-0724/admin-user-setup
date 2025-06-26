import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReportOperationalBillsComponent } from './aging-report-operational-bills.component';

describe('AgingReportOperationalBillsComponent', () => {
  let component: AgingReportOperationalBillsComponent;
  let fixture: ComponentFixture<AgingReportOperationalBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingReportOperationalBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingReportOperationalBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
