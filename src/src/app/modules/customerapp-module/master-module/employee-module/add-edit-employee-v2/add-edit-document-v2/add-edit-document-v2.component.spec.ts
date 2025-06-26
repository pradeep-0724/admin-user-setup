import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentV2Component } from './add-edit-document-v2.component';

describe('AddEditDocumentV2Component', () => {
  let component: AddEditDocumentV2Component;
  let fixture: ComponentFixture<AddEditDocumentV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDocumentV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDocumentV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
