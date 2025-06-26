import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderAdditionalChargesComponent } from './sales-order-additional-charges.component';

describe('SalesOrderAdditionalChargesComponent', () => {
  let component: SalesOrderAdditionalChargesComponent;
  let fixture: ComponentFixture<SalesOrderAdditionalChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderAdditionalChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderAdditionalChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
