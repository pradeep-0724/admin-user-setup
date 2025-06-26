import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVendorBillListComponent } from './all-vendor-bill-list.component';

describe('AllVendorBillListComponent', () => {
  let component: AllVendorBillListComponent;
  let fixture: ComponentFixture<AllVendorBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllVendorBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVendorBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
