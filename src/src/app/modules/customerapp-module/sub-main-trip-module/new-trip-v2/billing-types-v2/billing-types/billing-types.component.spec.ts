import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTypesComponent } from './billing-types.component';

describe('BillingTypesComponent', () => {
  let component: BillingTypesComponent;
  let fixture: ComponentFixture<BillingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
