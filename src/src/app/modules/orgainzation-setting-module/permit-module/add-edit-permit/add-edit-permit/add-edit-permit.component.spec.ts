import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPermitComponent } from './add-edit-permit.component';

describe('AddEditPermitComponent', () => {
  let component: AddEditPermitComponent;
  let fixture: ComponentFixture<AddEditPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditPermitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
