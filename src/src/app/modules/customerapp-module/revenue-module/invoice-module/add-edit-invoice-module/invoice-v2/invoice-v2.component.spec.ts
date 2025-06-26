import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceV2Component } from './invoice-v2.component';

describe('InvoiceV2Component', () => {
  let component: InvoiceV2Component;
  let fixture: ComponentFixture<InvoiceV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
