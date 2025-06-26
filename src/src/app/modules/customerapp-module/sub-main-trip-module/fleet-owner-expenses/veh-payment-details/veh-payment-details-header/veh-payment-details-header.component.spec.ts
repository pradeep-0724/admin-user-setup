import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehPaymentDetailsHeaderComponent } from './veh-payment-details-header.component';

describe('VehPaymentDetailsHeaderComponent', () => {
  let component: VehPaymentDetailsHeaderComponent;
  let fixture: ComponentFixture<VehPaymentDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehPaymentDetailsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehPaymentDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
