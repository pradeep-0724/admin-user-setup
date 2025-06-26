import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByCustomerInfoComponent } from './sales-by-customer-info.component';

describe('SalesByCustomerInfoComponent', () => {
  let component: SalesByCustomerInfoComponent;
  let fixture: ComponentFixture<SalesByCustomerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesByCustomerInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
