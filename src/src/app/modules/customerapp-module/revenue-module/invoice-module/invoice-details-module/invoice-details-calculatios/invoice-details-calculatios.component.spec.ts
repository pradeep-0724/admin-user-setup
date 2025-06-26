import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsCalculatiosComponent } from './invoice-details-calculatios.component';

describe('InvoiceDetailsCalculatiosComponent', () => {
  let component: InvoiceDetailsCalculatiosComponent;
  let fixture: ComponentFixture<InvoiceDetailsCalculatiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsCalculatiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsCalculatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
