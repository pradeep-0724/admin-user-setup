import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaInvoiceListComponent } from './performa-invoice-list.component';

describe('PerformaInvoiceListComponent', () => {
  let component: PerformaInvoiceListComponent;
  let fixture: ComponentFixture<PerformaInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
