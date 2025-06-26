import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumntPopupComponent } from './add-edit-documnt-popup.component';

describe('AddEditDocumntPopupComponent', () => {
  let component: AddEditDocumntPopupComponent;
  let fixture: ComponentFixture<AddEditDocumntPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumntPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDocumntPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
