import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreformaInvoiceComponent } from './preforma-invoice.component';

describe('PreformaInvoiceComponent', () => {
  let component: PreformaInvoiceComponent;
  let fixture: ComponentFixture<PreformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
