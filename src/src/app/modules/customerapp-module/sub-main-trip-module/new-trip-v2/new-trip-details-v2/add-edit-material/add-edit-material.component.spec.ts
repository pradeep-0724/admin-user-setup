import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBillingTypesComponent } from './add-edit-material.component';

describe('AddEditBillingTypesComponent', () => {
  let component: AddEditBillingTypesComponent;
  let fixture: ComponentFixture<AddEditBillingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBillingTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBillingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
