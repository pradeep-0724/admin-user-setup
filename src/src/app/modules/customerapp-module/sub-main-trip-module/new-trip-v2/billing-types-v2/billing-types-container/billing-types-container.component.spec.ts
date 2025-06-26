import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTypesContainerComponent } from './billing-types-container.component';

describe('BillingTypesContainerComponent', () => {
  let component: BillingTypesContainerComponent;
  let fixture: ComponentFixture<BillingTypesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingTypesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingTypesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
