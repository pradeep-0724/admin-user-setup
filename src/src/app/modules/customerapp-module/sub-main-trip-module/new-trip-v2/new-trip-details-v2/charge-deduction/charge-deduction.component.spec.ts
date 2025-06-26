import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeDeductionComponent } from './charge-deduction.component';

describe('ChargeDeductionComponent', () => {
  let component: ChargeDeductionComponent;
  let fixture: ComponentFixture<ChargeDeductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeDeductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
