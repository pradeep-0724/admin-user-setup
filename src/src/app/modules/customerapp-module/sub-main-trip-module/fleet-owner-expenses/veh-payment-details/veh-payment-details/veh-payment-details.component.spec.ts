import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehPaymentDetailsComponent } from './veh-payment-details.component';

describe('VehPaymentDetailsComponent', () => {
  let component: VehPaymentDetailsComponent;
  let fixture: ComponentFixture<VehPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
