import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInvoiceSettelmentComponent } from './detail-invoice-settelment.component';

describe('DetailInvoiceSettelmentComponent', () => {
  let component: DetailInvoiceSettelmentComponent;
  let fixture: ComponentFixture<DetailInvoiceSettelmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInvoiceSettelmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInvoiceSettelmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
