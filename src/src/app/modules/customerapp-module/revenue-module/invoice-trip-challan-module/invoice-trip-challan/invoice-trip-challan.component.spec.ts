import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTripChallanComponent } from './invoice-trip-challan.component';

describe('InvoiceTripChallanComponent', () => {
  let component: InvoiceTripChallanComponent;
  let fixture: ComponentFixture<InvoiceTripChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceTripChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTripChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
