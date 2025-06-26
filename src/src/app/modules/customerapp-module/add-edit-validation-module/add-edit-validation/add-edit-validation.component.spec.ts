import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditValidationComponent } from './add-edit-validation.component';

describe('AddEditValidationComponent', () => {
  let component: AddEditValidationComponent;
  let fixture: ComponentFixture<AddEditValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
