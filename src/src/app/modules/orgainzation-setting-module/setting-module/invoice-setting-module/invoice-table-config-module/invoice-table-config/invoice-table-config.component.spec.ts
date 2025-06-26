import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTableConfigComponent } from './invoice-table-config.component';

describe('InvoiceTableConfigComponent', () => {
  let component: InvoiceTableConfigComponent;
  let fixture: ComponentFixture<InvoiceTableConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTableConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
