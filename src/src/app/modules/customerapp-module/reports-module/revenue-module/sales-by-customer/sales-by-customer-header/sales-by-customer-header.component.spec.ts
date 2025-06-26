import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByCustomerHeaderComponent } from './sales-by-customer-header.component';

describe('SalesByCustomerHeaderComponent', () => {
  let component: SalesByCustomerHeaderComponent;
  let fixture: ComponentFixture<SalesByCustomerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesByCustomerHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByCustomerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
