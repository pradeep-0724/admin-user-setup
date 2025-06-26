import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerKycComponent } from './customer-kyc.component';

describe('CustomerKycComponent', () => {
  let component: CustomerKycComponent;
  let fixture: ComponentFixture<CustomerKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
