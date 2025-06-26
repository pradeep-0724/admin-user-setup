import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoBillingTypesComponent } from './so-billing-types.component';

describe('SoBillingTypesComponent', () => {
  let component: SoBillingTypesComponent;
  let fixture: ComponentFixture<SoBillingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoBillingTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoBillingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
