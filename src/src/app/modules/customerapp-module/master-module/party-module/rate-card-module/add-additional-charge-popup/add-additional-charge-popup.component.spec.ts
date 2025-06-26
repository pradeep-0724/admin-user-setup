import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditionalChargePopupComponent } from './add-additional-charge-popup.component';

describe('AddAdditionalChargePopupComponent', () => {
  let component: AddAdditionalChargePopupComponent;
  let fixture: ComponentFixture<AddAdditionalChargePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdditionalChargePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdditionalChargePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
