import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsItemOthersComponent } from './invoice-details-item-others.component';

describe('InvoiceDetailsItemOthersComponent', () => {
  let component: InvoiceDetailsItemOthersComponent;
  let fixture: ComponentFixture<InvoiceDetailsItemOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsItemOthersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsItemOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
