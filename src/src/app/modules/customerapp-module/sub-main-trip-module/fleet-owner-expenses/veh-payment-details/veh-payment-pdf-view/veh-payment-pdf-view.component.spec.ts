import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehPaymentPdfViewComponent } from './veh-payment-pdf-view.component';

describe('VehPaymentPdfViewComponent', () => {
  let component: VehPaymentPdfViewComponent;
  let fixture: ComponentFixture<VehPaymentPdfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehPaymentPdfViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehPaymentPdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
