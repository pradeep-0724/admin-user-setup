import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTimesheetComponent } from './invoice-timesheet.component';

describe('InvoiceTimesheetComponent', () => {
  let component: InvoiceTimesheetComponent;
  let fixture: ComponentFixture<InvoiceTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
