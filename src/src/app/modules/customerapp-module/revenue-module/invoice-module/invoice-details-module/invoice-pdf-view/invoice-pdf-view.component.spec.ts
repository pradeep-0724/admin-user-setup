import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePdfViewComponent } from './invoice-pdf-view.component';

describe('InvoicePdfViewComponent', () => {
  let component: InvoicePdfViewComponent;
  let fixture: ComponentFixture<InvoicePdfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePdfViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
