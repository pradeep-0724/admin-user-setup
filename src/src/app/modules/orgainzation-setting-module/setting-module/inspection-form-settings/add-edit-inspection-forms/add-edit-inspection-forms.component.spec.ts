import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInspectionFormsComponent } from './add-edit-inspection-forms.component';

describe('AddEditInspectionFormsComponent', () => {
  let component: AddEditInspectionFormsComponent;
  let fixture: ComponentFixture<AddEditInspectionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditInspectionFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditInspectionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
