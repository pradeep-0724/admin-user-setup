import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsChargesComponent } from './invoice-details-charges.component';

describe('InvoiceDetailsChargesComponent', () => {
  let component: InvoiceDetailsChargesComponent;
  let fixture: ComponentFixture<InvoiceDetailsChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
